import { useRef, useEffect } from 'react';
import supabase from './supabase';

// Make an API request which serves a file to `/api/{path}`
export async function apiRequestFile(path, method = 'GET', data) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session ? session.access_token : undefined;
  //console.log('DATA', JSON.stringify(data));
  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((response) => response.json());
  //.then((response) => console.log(response));
}

// Make an API request to `/api/{path}`
export async function apiRequest(path, method = 'GET', data) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session ? session.access_token : undefined;
  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status === 'error') {
        // Automatically signout user if accessToken is no longer valid
        if (response.code === 'auth/invalid-user-token') {
          supabase.auth.signOut();
        }

        throw new CustomError(response.code, response.message);
      } else {
        return response.data;
      }
    });
}

// Make an API request to any external URL
export function apiRequestExternal(url, method = 'GET', data) {
  return fetch(url, {
    method: method,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((response) => response.json());
}

// Create an Error with custom message and code
export function CustomError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// Hook that returns previous value of state
export function usePrevious(state) {
  const ref = useRef();
  useEffect(() => {
    ref.current = state;
  });
  return ref.current;
}

export function arrMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    let i = newIndex - arr.length + 1;
    while (i--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}
