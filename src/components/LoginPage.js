import { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, Controller } from 'react-hook-form';
import { Link } from "react-router-dom";
import firebase from '../firebase';


export default function LoginPage(){

    const { control, register, handleSubmit,formState:{errors}, watch } = useForm();


    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);

    const onLogin = async(data) => {
        try{
            setLoading(true);
            await firebase
            .auth().signInWithEmailAndPassword(data.email, data.password)
            //정보를 데이터베이스에 저장
            setLoading(false);

            
        }catch(error){
            console.log(error)
            setLoading(false);
            
            setTimeout(() => {
                setSubmitError("");
            }, 3000);
        }
        
    }

    return(
        <div id="login-page">
            <div className="form-box"> 
            <form onSubmit={handleSubmit(onLogin)}>
            <h2 className="text-center">LOGIN</h2> 
            <Form.Group>
                <Form.Label>이메일</Form.Label>
                    <Controller
                    control={control}
                    name="email"
                    defaultValue=""
                    register={register("email",{
                        required:true,
                    })}
                    render={({field})=> (
                        <Form.Control {...field}/>
                    )}
                    />
                    {errors.name?.type === "required" && <Form.Text>This name is required</Form.Text>}
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
            
            {submitError && <Form.Text>{submitError}</Form.Text>}
            <input type="submit" value="로그인" className="btn btn-primary btn-register" disabled={loading} />
            
            </form>
            <div className="mt-4">
            <Link to="/">회원가입하기</Link>
            </div>
            
            </div>
            
        </div>
    )
}