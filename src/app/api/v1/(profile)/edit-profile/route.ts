import {
  deleteCloudinaryImage,
  uploadCloudinaryImage,
} from "@/lib/cloudinary/cloudinary";
import { response } from "@/utils/helpers/response";
import { decodedToken } from "@/utils/helpers/token";
import prisma from "@/lib/prisma/prisma";
import { emailFetch, userNameFetch } from "@/utils/user_fetch";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const validateReq = async (body: FormData) => {
  const emailExist: any =
    body.get("email") && (await emailFetch(body.get("email") as string));
  const decodedUser: any = decodedToken(
    cookies().get("token")?.value as string
  );
  const nameExist: any =
    body.get("username") &&
    (await userNameFetch(body.get("username")?.toString()));
  const user: any = await prisma.user.findFirst({
    where: { id: decodedUser.id },
  });

  const step = Number(body.get("step"));
  const lastName = body.get("lastName")?.toString();
  const firstName = body.get("firstName")?.toString();
  const dob = body.get("dob")?.toString();
  const avatar = body.get("avatar");
  const username = body.get("username")?.toString();
  const email = body.get("email")?.toString();
  const bio = body.get("bio")?.toString();

  if (step) {
    if (step === 1) {
      if (lastName && firstName) {
        const userData = {
          lastName: lastName,
          firstName: firstName,
        };
        return userData;
      } else {
        const errors = {};
        if (!lastName) {
          errors["lastName"] = "last name is required.";
        }
        if (!firstName) {
          errors["firstName"] = "first name is required.";
        }

        return response.dataInvalid("data is required.", {
          ...errors,
        });
      }
    } else if (step === 2) {
      if (dob) {
        const userData = {
          dob: new Date(dob).toISOString(),
        };
        return userData;
      } else {
        return response.dataInvalid("date of birth is required.", {
          dob: "date of birth is required.",
        });
      }
    } else if (step === 3) {
      if (avatar) {
        if (user.avatar !== null) {
          await deleteCloudinaryImage(user.avatar);
        }
        const { public_id } = await uploadCloudinaryImage(avatar as File);
        const userData = { avatar: public_id };
        return userData;
      } else {
        return response.success("Profile Set.", {});
      }
    } else {
      return response.dataInvalid("step is invalid.");
    }
  } else {
    const userData = {};
    lastName && (userData["lastName"] = lastName);
    firstName && (userData["firstName"] = firstName);
    dob && (userData["dob"] = dob);
    bio && (userData["bio"] = bio);

    if (avatar) {
      if (user.avatar !== null) {
        await deleteCloudinaryImage(user.avatar);
      }
      const { public_id } = await uploadCloudinaryImage(avatar as File);
      userData["avatar"] = public_id;
    }

    if (username) {
      if (nameExist && decodedUser.id !== nameExist.id) {
        return response.dataConflict("username already taken.", {
          username: "username already taken.",
        });
      } else {
        userData["username"] = username;
      }
    }

    if (email) {
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return response.dataInvalid("email is not valid.", {
          email: "email is not valid.",
        });
      } else if (emailExist && decodedUser.id !== emailExist.id) {
        return response.dataConflict("email already taken.", {
          email: "email already taken.",
        });
      } else {
        userData["email"] = email;
      }
    }

    return userData;
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.formData();
    const updatedUser = await validateReq(body);
    if (updatedUser instanceof NextResponse) {
      return updatedUser;
    }
    const decodedUser: any = decodedToken(
      cookies().get("token")?.value as string
    );

    const user = await prisma.user.update({
      where: { id: decodedUser.id },
      data: updatedUser,
    });

    cookies().set("currentUser", JSON.stringify(user));
    return response.success("user data updated successfully.", user);
  } catch (error: any) {
    return response.error(error.message);
  }
};
