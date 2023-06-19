import axios from 'axios';

const baseUrl = '/api/blogs';
let token;
const config = () => ({
  headers: {
    Authorization: token,
  },
});

const setToken = (rawToken) => {
  token = `Bearer ${rawToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, config());
  return response.data;
};

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config());
  return response.data;
};
const deleteBlog = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, config());
};
// eslint-disable-next-line import/no-anonymous-default-export
export default { setToken, getAll, create, update, deleteBlog };
