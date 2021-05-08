import { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, Controller } from 'react-hook-form';
import { Link } from "react-router-dom";
import firebase from '../firebase';
import md5 from 'md5';

export default function RegisterPage(){

    const { control, register, handleSubmit,formState:{errors}, watch } = useForm();

    const password = useRef();
    password.current = watch("password")

    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSave = async(data) => {
        try{
            setLoading(true);
            let createUser = await firebase.auth()
            .createUserWithEmailAndPassword(data.email, data.password);
            //유저 정보를 추가 및 업데이트
            await createUser.user.updateProfile({
                displayName: data.name,
                photoURL: `http//:gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
            })
            console.log('createUser', createUser);
            //정보를 데이터베이스에 저장
            await firebase.database().ref('users').child(createUser.user.uid).set({
                name : createUser.user.displayName,
                image: createUser.user.photoURL
            })

            setLoading(false);
        }catch(error){
            console.log(error)
            setLoading(false);
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/weak-password') {
                setSubmitError('The password is too weak.');
            } else {
                setSubmitError(errorMessage);
            }
            setTimeout(() => {
                setSubmitError("");
            }, 3000);
        }
        
    }

    return(
        <div id="register-page">
            <div className="form-box">
                <h2 className="text-center">REGISTER</h2> 
            <form onSubmit={handleSubmit(onSave)}>
            <Form.Group>
                <Form.Label>email</Form.Label>
                    <Controller
                    control={control}
                    name="email"
                    defaultValue=""
                    register={register("email",{
                        required: true,
                        pattern: /^\S+@\S+$/i
                    })}
                    render={({field})=> (
                        <Form.Control {...field} />
                    )}
                    />
                {errors.email && <Form.Text>This email is required</Form.Text>}
            </Form.Group>
            <Form.Group>
                <Form.Label>이름</Form.Label>
                    <Controller
                    control={control}
                    name="name"
                    defaultValue=""
                    register={register("name",{
                        required:true,
                        maxLength: 10
                    })}
                    render={({field})=> (
                        <Form.Control {...field}/>
                    )}
                    />
                    {errors.name?.type === "required" && <Form.Text>This name is required</Form.Text>}
                    {errors.name?.type === "maxLength" && <Form.Text>Your input exceed maximum lenght </Form.Text>}
            </Form.Group>
            <Form.Group>
                <Form.Label>비밀번호</Form.Label>
                    <Controller
                    control={control}
                    name="password"
                    defaultValue=""
                    register={register("password",{
                        required:true
                    })}
                    render={({field})=> (
                        <Form.Control {...field}/>
                    )}
                    />
                    {errors.password?.type === "required" && <Form.Text>This password is required</Form.Text>}
            </Form.Group>
            <Form.Group>
                <Form.Label>비밀번호</Form.Label>
                    <Controller
                    control={control}
                    name="pw_confirmed"
                    defaultValue=""
                    register={register("pw_confirmed",{
                        required:true,
                        validate: (value) => value === password.current
                    })}
                    render={({field})=> (
                        <Form.Control {...field}/>
                    )}
                    />
                    {errors.pw_confirmed?.type === "required" && <Form.Text>This password is required</Form.Text>}
                    {errors.pw_confirmed?.type === "validate" && <Form.Text>This password isn't same</Form.Text>}
            </Form.Group>
            {submitError && <Form.Text>{submitError}</Form.Text>}
            <input type="submit" value="회원가입하기" className="btn btn-primary btn-register" disabled={loading} />
            
            </form>
            <div className="mt-4">
            <Link to="/login">이미 아이디가 있다면...</Link>
            </div>
            
            </div>
            
        </div>
    )
}