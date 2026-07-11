import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./connectDb";
import User from "@/models/User";
import bcrypt from 'bcrypt'

export const {handlers,signIn,signOut,auth}=NextAuth({
    providers:[
        GitHub({
            clientId:process.env.GITHUB_ID,
            clientSecret:process.env.GITHUB_SECRET,
        }),
        Credentials({
            credentials:{
                email:{
                    label:'email',
                    type:'email'
                },
                password:{
                    label:'password',
                    type:'password',
                }
            },
            async authorize(credentials){
                try {
                    await connectDb();
                    const user = await User.findOne({email:credentials.email.toLowerCase()}).select('+password');
                    if(!user){
                        return null
                    }
                    if(!user.password){
                        return null
                    }   
                    const isMatch = await bcrypt.compare(credentials.password,user.password);
                    if(!isMatch){
                        return null 
                    }
                    return {
                        id:user._id.toString(),
                        name:user.name,
                        email:user.email,
                    }
                } catch (error) {
                    console.error(error)
                    return null;
                }
            }
        }),
    ],
    secret:process.env.NEXTAUTH_SECRET,
    session:{
        strategy:'jwt'
    },
    pages:{
        signIn:'/login',
    },
    callbacks:{
        async jwt({token,user,account}){
            if(user){
                if(account?.provider==='github'){
                    let existingUser = await User.findOne({email:user.email.toLowerCase()});
                    if(!existingUser){
                        await User.create({
                            name:user.name,
                            email:user.email.toLowerCase(),
                            password:null,
                        })
                    }
                    token.id = existingUser.id;
                    token.email = existingUser.email;
                }
                if(account?.provider==='credentials'){
                    token.id = user.id;
                    token.email = user.email;
                }
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user.id = token.id;
                session.user.email = token.email;
            }
            return session;
        }
    }
})