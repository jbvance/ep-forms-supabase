import requireAuth from '../_require-auth';
import supabase from 'util/supabase';

const handler = async (req, res) => {
  const { data, error } = await supabase
    .from('mpoa')
    .select('json_value')
    .eq('user_id', req.user.id);
  console.log('DATA', data);
};

export default requireAuth(handler);
