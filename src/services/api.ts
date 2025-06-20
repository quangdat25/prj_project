import axios from "services/axios.customize";

export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { username, password },
    {
      headers: {
        delay: 1000,
      },
    }
  );
};
export const registerAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user/register";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};
export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";

  return axios.get<IBackendRes<IFetch>>(urlBackend, {
    headers: {
      delay: 1000,
    },
  });
};
export const logoutAccountAPI = () => {
  const urlBackend = "/api/v1/auth/logout";

  return axios.post<IBackendRes<IRegister>>(urlBackend);
};
export const getUsersAPI = (query: string) => {
  const urlBackend = `/api/v1/user?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};
export const createUserAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};
export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    _id,
    fullName,
    phone,
  });
};
export const deleteUserApi = (_id: string) => {
  const urlBackend = `/api/v1/user/${_id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const deleteBookAPI = (_id: string) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.delete<IBackendRes<IBookTable>>(urlBackend);
};
export const uploadImageAPI = () => {
  const urlBackend = "/api/v1/file/upload";
  return axios.post<IBackendRes<IBookTable>>(urlBackend);
};
export const createNewBookAPI = (
  _id: string,
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string
) => {
  const urlBackend = "/api/v1/book";
  return axios.post<IBackendRes<IBookTable>>(urlBackend, {
    _id,
    mainText,
    author,
    price,
    quantity,
    category,
    thumbnail,
    slider,
  });
};
export const getBookcategory = () => {
  const urlBackend = "/api/v1/database/category";
  return axios.get<IBackendRes<string[]>>(urlBackend);
};
export const getBookAPI = (query: string) => {
  const urlBackend = `/api/v1/book?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(
    urlBackend,

    {
      headers: {
        delay: 500,
      },
    }
  );
};
