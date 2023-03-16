import supabase from './_supabase';
import requireAuth from './_require-auth';

const handler = async (req, res) => {
  //const user = await supabase.auth.getUser();
  //console.log('USER', user);
  // const user = await supabase.auth.getUser(
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjc4OTk4MDkxLCJzdWIiOiJmNjUwM2ZkYS0zMzQyLTQ4YmUtOTM5My1iYWE4M2Q1YTlhNmEiLCJlbWFpbCI6ImpidmFuY2VAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE2Nzg5NzU0MDZ9XSwic2Vzc2lvbl9pZCI6IjcwYTQ5MGM4LTljNDEtNDBhOC1hZGJiLWVmOGFlMzNhNTFiYiJ9.Y4UEG31VjNCdAcdCNEVAL9hoLAU_hZd-BH1MRef9jug'
  // );

  //console.log(user);
  //const { data, error } = await supabase.from('dpoa').select('*');
  //console.log(data);
  res.status(200).json({ message: 'Success' });
};

export default requireAuth(handler);
