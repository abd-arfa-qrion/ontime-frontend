import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt, { JwtPayload } from "jsonwebtoken";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "Recaptcha Token", type: "hidden" },
      },

      async authorize(credentials, req) {
        // Validasi reCAPTCHA
        console.log(
          "ini secret key grecaptcha:",
          process.env.GRECAPTCHA_SECRET_KEY,
        );
        const recaptchaResponse = await fetch(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              secret: process.env.GRECAPTCHA_SECRET_KEY || "", // Gunakan secret key reCAPTCHA Anda
              response: credentials?.recaptchaToken || "",
            }),
          },
        );

        const recaptchaResult = await recaptchaResponse.json();
        if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
          throw new Error("Validasi reCAPTCHA gagal.");
        }
        // validasi recaptcha end

        try {
          // Request dulu ke backend
          const req = await fetch(
            `${process.env.BACKEND_API_BASEURL}/auth/web/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-App-Type": "web",
              },
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
            },
          );

          // deklarasikan Response Data
          const resData = await req.json();
          // console.log(resData)
          if (resData) {
            if (resData.status_code === 200) {
              return resData.data;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (error) {
          // console.log(error)
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials") {
        if (user.token) {
          try {
            const decodedToken = jwt.decode(user.token);

            // Safely add decoded information to the token object
            if (decodedToken && typeof decodedToken === "object") {
              const decodedTokenWithEmail = decodedToken as JwtPayload & {
                email: string;
              };
              token.email = decodedTokenWithEmail.email;
              token.name = decodedTokenWithEmail.name;
              token.role = decodedTokenWithEmail.role;
              token.id = decodedTokenWithEmail.user_id;
              token.image = decodedTokenWithEmail.image;
              token.sub = decodedTokenWithEmail.iss;
              token.username = decodedTokenWithEmail.username;
              token.instansiId = decodedTokenWithEmail.inst;
              token.instansi = decodedTokenWithEmail.insid;
              token.namaInstansi = decodedTokenWithEmail.namaInstansi;
              token.instAddInfo = decodedTokenWithEmail.instAddInfo;
              token.namaPerusahaan = decodedTokenWithEmail.namaPerusahaan;
              token.accessToken = user.token;
              token.logo = user.logo;
            }
          } catch (error) {
            console.error("Error decoding JWT:", error);
          }
        }
      }
      if (account?.provider === "google") {
        const data = {
          email: user.email,
          name: user.name,
          image: user.image,
          type: "google",
        };
        const response = await fetch(
          `${process.env.BACKEND_API_BASEURL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );
      }
      return token;
    },
    async session({ session, token }: any) {
      if ("email" in token) {
        session.user.email = token.email;
      }
      if ("fullname" in token) {
        session.user.name = token.name;
      }
      if ("role" in token) {
        session.user.role = token.role;
      }
      if ("image" in token) {
        session.user.image = token.image;
      }
      if ("id" in token) {
        session.user.id = token.id;
      }
      if ("username" in token) {
        session.user.username = token.username;
      }
      if ("sub" in token) {
        session.user.sub = token.sub;
      }
      if ("instansiId" in token) {
        session.user.instansiId = token.instansiId;
      }
      if ("instansi" in token) {
        session.user.instansi = token.instansi;
      }
      if ("namaInstansi" in token) {
        session.user.namaInstansi = token.namaInstansi;
      }
      if ("instAddInfo" in token) {
        session.user.instAddInfo = token.instAddInfo;
      }
      if ("namaPerusahaan" in token) {
        session.user.namaPerusahaan = token.namaPerusahaan;
      }
      // console.log(session.user)
      session.accessToken = token.accessToken;
      session.logo = token.logo;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};
export default NextAuth(authOptions);
