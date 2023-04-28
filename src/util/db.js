import {
  useQuery,
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from 'react-query';
import supabase from './supabase';

// React Query client
const client = new QueryClient();

/**** USERS ****/

// Fetch user data
// Note: This is called automatically in `auth.js` and data is merged into `auth.user`
export function useUser(uid) {
  // Manage data fetching with React Query: https://react-query.tanstack.com/overview
  return useQuery(
    // Unique query key: https://react-query.tanstack.com/guides/query-keys
    ['user', { uid }],
    // Query function that fetches data
    () =>
      supabase
        .from('users')
        .select(`*, customers ( * )`)
        .eq('id', uid)
        .single()
        .then(handle),
    // Only call query function if we have a `uid`
    { enabled: !!uid }
  );
}

// Fetch user data (non-hook)
// Useful if you need to fetch data from outside of a component
export function getUser(uid) {
  return supabase
    .from('users')
    .select(`*, customers ( * )`)
    .eq('id', uid)
    .single()
    .then(handle);
}

// Update an existing user
export async function updateUser(uid, data) {
  const response = await supabase
    .from('users')
    .update(data)
    .eq('id', uid)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(['user', { uid }]);
  return response;
}

/**** ITEMS ****/
/* Example query functions (modify to your needs) */

// Fetch item data
export function useItem(id) {
  return useQuery(
    ['item', { id }],
    () => supabase.from('items').select().eq('id', id).single().then(handle),
    { enabled: !!id }
  );
}

// Fetch all items by owner
export function useItemsByOwner(owner) {
  return useQuery(
    ['items', { owner }],
    () =>
      supabase
        .from('items')
        .select()
        .eq('owner', owner)
        .order('createdAt', { ascending: false })
        .then(handle),
    { enabled: !!owner }
  );
}

// Create a new item
export async function createItem(data) {
  const response = await supabase.from('items').insert([data]).then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(['items']);
  return response;
}

// Update an item
export async function updateItem(id, data) {
  const response = await supabase
    .from('items')
    .update(data)
    .eq('id', id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(['item', { id }]),
    client.invalidateQueries(['items']),
  ]);
  return response;
}

// Delete an item
export async function deleteItem(id) {
  const response = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(['item', { id }]),
    client.invalidateQueries(['items']),
  ]);
  return response;
}

// Update payment status of user_docs
export async function updateUserDocsPaidStatus(paymentIntentId, paid) {
  const response = await supabase
    .from('user_docs')
    .update({
      paid: paid,
    })
    .eq('payment_intent_id', paymentIntentId)
    .select()
    .then(handle);
  return response;
}

//**************CLIENT CONTACT INFO *****/
// Fetch conact info by user id
export function useClientContactInfoByUser(userId) {
  return useQuery(
    ['client_contact_info', { userId }],
    () =>
      supabase
        .from('client_contact')
        .select()
        .eq('user_id', userId)
        .then(handle),
    { enabled: !!userId }
  );
}

/***********CONTACTS********** */

// Fetch all contacts by owner
export function useContactsByUser(userId) {
  return useQuery(
    ['user_contacts', { userId }],
    () =>
      supabase
        .from('user_contacts')
        .select()
        .eq('user_id', userId)
        //.order('createdAt', { ascending: false })
        .then(handle),
    { enabled: !!userId }
  );
}

export function useContact(id) {
  return useQuery(
    ['user_contacts', { id }],
    () =>
      supabase
        .from('user_contacts')
        .select('*')
        .eq('id', id)
        .single()
        .then(handle),
    { enabled: !!id }
  );
}

// Create a new user_contact
export async function createContact(data) {
  const response = await supabase
    .from('user_contacts')
    .insert([data])
    .select()
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(['user_contacts']);
  return response;
}

// Update a contact
export async function updateContact(id, data) {
  const response = await supabase
    .from('user_contacts')
    .update(data)
    .eq('id', id)
    .select()
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(['user_contacts', { id }]),
    client.invalidateQueries(['user_contacts']),
  ]);
  return response;
}

// Get contacts for a user by user's id
export async function getContactsByUserId(userId) {
  const response = await supabase
    .from('user_contacts')
    .select()
    .eq('user_id', userId)
    .then(handle);
  return response;
}

export async function getContactById(id) {
  const response = await supabase
    .from('user_contacts')
    .select()
    .eq('id', id)
    .then(handle);
  return response;
}

export async function addUserDocPaymentIntent(
  userId,
  docTypeId,
  paymentIntentId
) {
  // console.log('USERID', userId);
  // console.log('DOCTYPEID', docTypeId);
  const response = await supabase
    .from('user_docs')
    .insert({
      user_id: userId,
      doc_type_id: docTypeId,
      payment_intent_id: paymentIntentId,
    })
    .then(handle);
  return response;
}

/***** Not currently used - replaced by addUserDocPaymentIntent */
// export async function addorUpdateUserDoc(userId, docTypeId) {
//   // console.log('USERID', userId);
//   // console.log('DOCTYPEID', docTypeId);
//   const response = await supabase
//     .from('user_docs')
//     .upsert({
//       user_id: userId,
//       doc_type_id: docTypeId.id,
//     })
//     .then(handle);
//   return response;
// }

/*************** PRODUCTS ******************/
export async function getProducts() {
  const response = await supabase.from('document_types').select().then(handle);
  return response;
}

export async function getProductsByState(state) {
  const response = await supabase
    .from('document_types')
    .select()
    .equal(state)
    .then(handle);
  return response;
}

/************* SPOUSE INFO ****************** */
export async function getSpouseInfo(uid) {
  const response = await supabase
    .from('users')
    .select(
      `     
      spouses (
        id,
        user_id,
        name,
        email
      )
    `
    )
    .eq('id', uid)
    .single()
    .then(handle);
  return response;
}

/************* STATE FETCHING *******************/
export async function fetchState(uid, type) {
  const response = await supabase
    .from(type)
    .select('json_value')
    .eq('user_id', uid)
    .then(handle);
  return response;
}
/**** HELPERS ****/

// Get response data or throw error if there is one
function handle(response) {
  if (response.error) throw response.error;
  return response.data;
}

// React Query context provider that wraps our app
export function QueryClientProvider(props) {
  return (
    <QueryClientProviderBase client={client}>
      {props.children}
    </QueryClientProviderBase>
  );
}
