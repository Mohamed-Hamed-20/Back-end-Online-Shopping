import joi from "joi";
export const register = {
  // password, phone, address, answer
  body: joi
    .object({
      name: joi.string().min(3).max(22).required(),
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "gov"] } })
        .required(),
      password: joi
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
      address: joi.string().min(3).max(22).required(),
      phone: joi.string().min(10).max(12).required(),
      answer: joi.string().max(20),
    })
    .required(),
};

export const login = {
  body: joi
    .object({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "gov"] } })
        .required(),
      password: joi
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
    })
    .required(),
};

export const forgetPass = {
  body: joi
    .object({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net", "gov"] } })
        .required(),
    })
    .required(),
};
