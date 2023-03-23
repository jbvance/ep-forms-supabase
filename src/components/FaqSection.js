import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';

function FaqSection(props) {
  // Object to store expanded state for all items
  const [expanded, setExpanded] = useState({});
  // Set an item's expanded state
  const setExpandedItem = (index, isExpanded) => {
    setExpanded({
      ...expanded,
      [index]: isExpanded,
    });
  };

  const items = [
    {
      question: 'Why do I need powers of attorney?',
      answer:
        "A power of attorney authorizes someone (referred to as the agent) to make decisions or take actions on someone else's (known as the principal) behalf. There are several kinds of powers of attorney that will grant the agent the right to accomplish different things on the principal's behalf. Without powers of attorney, it may be necessary for a court to appoint a guardian for you, which can be a timely and expensive process.",
    },
    {
      question: 'What is a Durable Power of Attorney?',
      answer:
        "A durable power of attorney is a document that either takes effect upon or lasts after the principal's incapacitation. This is different from a general power of attorney, which usually terminates upon the principal's incapacity. With a Durable Power of Attorney, your agent can make make decisions to help manage your property, finances, and investments. For example, an agent acting under a power of attorney could be authorized to pay your bills on your behalf if you become incapacitated",
    },
    {
      question: 'What is a Medical Power of Attorney?',
      answer:
        'A medical power of attorney gives someone else the right to make decisions about his or her medical care on his or her behalf. If you are unable make decisions about your own medical care, a medical power of attorney would allow someone you trust to make those decisions for you. It is an important part of later-life planning and legal preparations for people with disabilities. ',
    },
    {
      question: 'What is a Living Will?',
      answer:
        'A Living Will (also sometime called a "Directive to Physicians") is a document that allows you to state what medical procedures you do and do not want performed. For example, a living will would allow you to tell doctors that you do not want to receive a blood transfusion, or whether you want to be kept on life support if you are in a coma. A medical power of attorney does not discuss specific procedures but instead gives someone else the authority to make decisions about those procedures for you.',
    },
    {
      question: 'Are you a law firm?',
      answer:
        'No, we are not a law firm and we do not offer legal advice. We offer forms that are designed to comply with relevant state statuetes, but you should verify whether a particular form is right for your circumstances.',
    },
  ];

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={2}
          spaced={true}
          className="text-center"
        />

        {items.map((item, index) => (
          <article
            className="FaqSection__faq-item py-4"
            onClick={() => {
              setExpandedItem(index, !expanded[index]);
            }}
            key={index}
          >
            <h4>
              <span className="text-primary mr-3">
                <i
                  className={
                    'fas' +
                    (expanded[index] ? ' fa-minus' : '') +
                    (!expanded[index] ? ' fa-plus' : '')
                  }
                />
              </span>
              {item.question}
            </h4>

            {expanded[index] && <div className="mt-3">{item.answer}</div>}
          </article>
        ))}
      </Container>
    </Section>
  );
}

export default FaqSection;
