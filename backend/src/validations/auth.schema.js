const { z } = require('zod');

const AuthSchemas = {
  candidateRegister: z.object({
    body: z.object({
      full_name: z.string().min(3),
      email: z.string().email(),
      phone: z.string().min(9).optional(),
    }),
  }),
  sendOtp: z.object({
    body: z.object({
      email: z.string().email(),
    }),
  }),
  verifyOtp: z.object({
    body: z.object({
      email: z.string().email(),
      otp: z.string().length(6),
    }),
  }),
  portalLogin: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
      type: z.enum(['ADMIN', 'PARTNER']),
    }),
  }),
};

module.exports = { AuthSchemas };
