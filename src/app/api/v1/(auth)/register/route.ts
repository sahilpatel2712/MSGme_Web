import { response } from "@/utils/helpers/response";
import { generateToken } from "@/utils/helpers/token";
import prisma from "@/lib/prisma/prisma";
import { emailFetch, userNameFetch } from "@/utils/user_fetch";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const validateReq = async (body: any) => {
  if (!body.username) {
    return response.dataInvalid("username is required.", {
      username: "username is required.",
    });
  }
  if (!body.email) {
    return response.dataInvalid("email is required.", {
      email: "email is required.",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(body.email)) {
    return response.dataInvalid("email is not valid.", {
      email: "email is not valid.",
    });
  }
  if (!body.password) {
    return response.dataInvalid("password is required.", {
      password: "password is required.",
    });
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_/+]).{8,}$/.test(
      body.password
    )
  ) {
    return response.dataInvalid(
      "Password should contain - minimum 1 capital and 1 small alphabet ,\n- 1 digit,\n- 1 special character and minimum 8 character.",
      {
        password:
          "Password should contain - minimum 1 capital and 1 small alphabet ,\n- 1 digit,\n- 1 special character and minimum 8 character.",
      }
    );
  }

  if ((await userNameFetch(body.username)) || (await emailFetch(body.email))) {
    return response.dataConflict("User already exists.");
  }

  return null;
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validationError = await validateReq(body);
    if (validationError) {
      return validationError;
    }

    const hash = crypto.createHash("sha1");
    hash.update(body.password);
    body.password = hash.digest("hex");

    const user = await prisma.user.create({
      data: body,
      select: { id: true, username: true, email: true },
    });

    cookies().set("currentUser", JSON.stringify(user), { secure: true });
    cookies().set(
      "token",
      await generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
      { secure: true }
    );

    const { password, ...userWithoutPassword } = user as {
      email: string;
      username: string;
      id: string;
      password: string;
    };
    return response.success("signed up successfully.", userWithoutPassword);
  } catch (error: any) {
    return response.error(error.message);
  }
};
