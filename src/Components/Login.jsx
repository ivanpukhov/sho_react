import React from 'react';
import {Field, Form, Formik} from 'formik';
import {Button, Input} from 'antd';
import InputMask from 'react-input-mask';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useAuth} from "../AuthContext";

const phoneNumberMask = "+7 (999) 999-99-99";

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth(); // Используйте функцию login из контекста

    const handleSubmit = async (values, {setSubmitting}) => {
        const cleanedPhoneNumber = values.phoneNumber.replace(/\D+/g, '');

        try {
            const response = await axios.post('https://lll.ix-web.site/api/users/login', {
                ...values,
                phoneNumber: cleanedPhoneNumber,
            });
            localStorage.setItem('token', response.data.token);
            login(response.data.token); // Обновите состояние аутентификации

            navigate('/profile');
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{maxWidth: '300px', margin: '50px auto'}}>
            <h2>Login</h2>
            <Formik
                initialValues={{phoneNumber: '',  password: ''}}
                onSubmit={handleSubmit}
            >
                {({setFieldValue, values}) => (
                    <Form>
                        <Field name="phoneNumber">
                            {({field}) => (
                                <InputMask
                                    {...field}
                                    mask={phoneNumberMask}
                                    value={values.phoneNumber}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setFieldValue("phoneNumber", value);
                                    }}
                                >
                                    {(inputProps) => <Input {...inputProps} />}
                                </InputMask>
                            )}
                        </Field>
                        <Field name="password" as={Input.Password} placeholder="Password"/>
                        <Button type="primary" htmlType="submit" style={{marginTop: '10px'}}>
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
