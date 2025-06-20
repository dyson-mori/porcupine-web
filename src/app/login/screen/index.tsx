"use client"

import { Suspense, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Input, Splash, Form, Animated } from "@components";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { setCookie } from "@utils/serverCookieAction";
import { api } from "@services/api";

import { Container, SignUp } from "./styles";
import { schema, schemaProps } from "./schema";

type StatusProps = {
  loading: boolean;
  status: 'primary' | 'error';
  message?: string;
};

export default function LoginScreen() {
  const route = useRouter();

  const [status, setStatus] = useState({ message: 'Enviar' } as StatusProps);

  const { control, handleSubmit, formState: { isValid } } = useForm<schemaProps>({
    resolver: yupResolver(schema)
  });

  async function submit(form: schemaProps) {
    setStatus({ loading: true, status: 'primary' });

    const data = await api.user.login({ user: form });

    if (data.status !== 200) {
      return setStatus({ loading: false, status: 'error', message: data.message });
    };

    setCookie(data.token);

    return route.push('/profile');
  };

  return (
    <Suspense fallback={<Splash />}>
      <Container>
        <Form onSubmit={handleSubmit(submit)}>

          <Animated />

          <Controller
            name='email'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input type="text" label="Email" value={value ?? ''} onChange={onChange} />
            )}
          />
          <Controller
            name='password'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input type="password" label="Senha" value={value ?? ''} onChange={onChange} />
            )}
          />

          <div style={{ height: 10 }} />

          <Button
            type="submit"
            $variant={status.status}
            loading={status.loading}
            disabled={!isValid || status.loading}
          >
            {status.message}
          </Button>

          <div style={{ height: 10 }} />

          <SignUp>
            <p>Você não tem um login? <Link href='/signup'>Clique aqui</Link></p>
          </SignUp>

        </Form>
      </Container>
    </Suspense>
  )
};
