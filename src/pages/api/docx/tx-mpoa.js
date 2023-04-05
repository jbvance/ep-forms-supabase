const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const requireAuth = require('../_require-auth');
const expressionParser = require('docxtemplater/expressions.js');
const { uploadFromBuffer, uploadFromUrl } = require('../../../util/uploadToS3');
const { getSignedUrlForFile } = require('../../../util/s3BucketsFiles');
const { createAndUploadPdf } = require('../../../util/pdf');

const ordinalInWord = (cardinal) => {
  var ordinals = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
    'Ninth',
    'Tenth',
  ];

  return ordinals[cardinal];
};

const createMpoaFromTemplate = async (req, res) => {
  // file name to use for saving to AWS, both .docx and .pdf
  const fileNameForSaving = 'Medical_Power_of_Attorney';

  try {
    const userId = req.user.id;
    const fs = require('fs');
    const path = require('path');
    //console.log('MEDICAL POA BODY***************', req.body);

    const dirRelativeToPublicFolder = 'docx-templates';
    const dir = path.resolve('./public', dirRelativeToPublicFolder);

    // Check for required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'city',
      'county',
      'address',
      'state',
      'zip',
      'agents',
    ];
    const missingField = requiredFields.find((field) => !(field in req.body));
    if (missingField) {
      return res.status(422).json({
        code: 422,
        status: 'error',
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField,
      });
    }

    // store values passed in variables
    const {
      firstName,
      middleName,
      suffix,
      lastName,
      address,
      city,
      county,
      state,
    } = req.body;
    const zipCode = req.body['zip'];
    const { agents } = req.body;
    const notaryCounty =
      req.body['notaryCounty'] && req.body['notaryCounty'].trim().length > 0
        ? req.body['notaryCounty'].toUpperCase()
        : '___________________';

    // Add user's name to fileNameForSaving
    const fileNameForSavingWithUserName = `${fileNameForSaving}--${firstName}_${lastName}`;

    const stringFields = [
      'firstName',
      'lastName',
      'middleName',
      'address',
      'city',
      'county',
      'state',
      'zip',
    ];
    const nonStringField = stringFields.find(
      (field) => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField,
      });
    }

    // Load the docx file as binary content
    //console.log('PATH', path.resolve(__dirname, '../../../../..'));
    // const content = fs.readFileSync(
    //   //path.resolve(__dirname, "../input.docx"),
    //   path.resolve(
    //     __dirname,
    //     '../../../../../src/docx-templates/TX_MPOA_Template.docx'
    //   ),
    //   'binary'
    // );
    const content = fs.readFileSync(
      path.resolve(dir, 'TX_MPOA_Template.docx'),
      'binary'
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: expressionParser,
    });

    const clientName = `${firstName.trim()}${
      middleName ? ' ' + middleName.trim() : ''
    } ${lastName.trim()}`;

    const blankLine = '______________________________________';
    const clientAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const primaryAgent = agents[0];
    const mpoaPrimaryAgentName = primaryAgent.fullName;
    const mpoaPrimaryAgentAddress =
      primaryAgent.address.trim().length > 0 ? primaryAgent.address : blankLine;
    const mpoaPrimaryAgentPhone =
      primaryAgent.phone && primaryAgent.phone.trim().length > 0
        ? primaryAgent.phone
        : blankLine;

    const mpoaAgents = agents.slice(1).map((a, index) => {
      return {
        name: a.fullName,
        address: a.address && a.address.length > 1 ? a.address : blankLine,
        phone: a.phone && a.phone.length > 1 ? a.phone : blankLine,
        ordinal: ordinalInWord(index),
      };
    });

    const docVars = {
      clientName,
      notaryCounty,
      mpoaPrimaryAgentName,
      mpoaPrimaryAgentAddress,
      mpoaPrimaryAgentPhone,
      mpoaAgents, // successor agents
      blankLine,
    };

    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render(docVars);

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    // fs.writeFileSync(
    //   path.resolve(
    //     __dirname,
    //     `../../../../../src/output-files/${userId}__tx-mpoa_output.docx`
    //   ),
    //   buf
    // );

    // save to S3 Bucket rather than save to local file system (as commented out above)
    await uploadFromBuffer(
      buf,
      `user-docs/${userId}/${fileNameForSavingWithUserName}.docx`
    );

    //Get the signed url to create PDF file
    const signedUrl = await getSignedUrlForFile(
      process.env.S3_BUCKET,
      `user-docs/${userId}/${fileNameForSavingWithUserName}.docx`,
      90
    );
    //console.log('SIGNED URL', signedUrl);
    if (!signedUrl) {
      throw new Error('No signed url was created');
    }

    // Create and upload PDF file to AWS
    const pdfUploadResult = await createAndUploadPdf(
      signedUrl,
      'Medical Power of Attorney',
      fileNameForSavingWithUserName,
      userId
    );
    if (
      !pdfUploadResult ||
      pdfUploadResult['$metadata']['httpStatusCode'] !== 200
    ) {
      throw new Error(
        `Unable to create/upload PDF file for Medical Power of Attorney`
      );
    }

    return res.status(201).json({
      code: 201,
      status: 'success',
      message: `MPOA File Created`,
    });
  } catch (err) {
    console.log('ERROR - MPOA', err.message);
    return res.status(500).json({
      code: 500,
      status: 'error',
      reason: err.message,
      message: 'Unable to create Medical POA',
      location: '/api/docx/tx-mpoa',
    });
  }
};

export default requireAuth(createMpoaFromTemplate);
