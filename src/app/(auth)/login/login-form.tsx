'use client';

import { logoWithText } from '@/assets';
import { Button, Col, InputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { ErrorCode, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useLoginMutation } from '@/queries';
import route from '@/routes';
import { loginSchema } from '@/schemaValidations';
import { LoginBodyType } from '@/types/auth.type';
import { notify, setData } from '@/utils';
import Image from 'next/image';
import PasswordField from '@/components/form/password-field';
import { useProfileStore } from '@/store';
import { CircleLoading } from '@/components/loading';
import { useNavigate } from '@/hooks';

export default function LoginForm() {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate(false);
  const { setAuthenticated, setLoading } = useProfileStore();
  const defaultValues: LoginBodyType = {
    email: 'admin@example.com',
    password: 'admin1236545'
  };

  const onSubmit = async (values: LoginBodyType) => {
    await loginMutation.mutateAsync(values, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Đăng nhập thành công');
          setData(storageKeys.ACCESS_TOKEN, res.data?.token!);
          setAuthenticated(true);
          setLoading(true);
          navigate(route.home.path);
        } else {
          const errCode = res.code;
          if (errCode) {
            if (errCode === ErrorCode.AUTH_ERROR_UNAUTHORIZED) {
              notify.error('Email hoặc mật khẩu không chính xác');
            }
          } else {
            notify.error('Đăng nhập thất bại');
          }
        }
      },
      onError: (error) => {
        logger.error('Error while logging in: ', error);
        notify.error('Đăng nhập thất bại');
      }
    });
  };

  return (
    <BaseForm
      defaultValues={defaultValues}
      schema={loginSchema}
      onSubmit={onSubmit}
      className='w-100 rounded-lg border border-solid border-gray-200 px-6 py-4 shadow-[0px_0px_10px_1px] shadow-slate-200'
    >
      {(form) => (
        <>
          <Row>
            <Col className='items-center'>
              <Image
                src={logoWithText.src}
                width={180}
                height={50}
                alt='Biblio Logo'
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputField
                name='email'
                control={form.control}
                label='Email'
                placeholder='Nhập email...'
                className='focus-visible:ring-dodger-blue'
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <PasswordField
                name='password'
                control={form.control}
                label='Mật khẩu'
                placeholder='Nhập mật khẩu...'
                className='focus-visible:ring-dodger-blue'
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                disabled={!form.formState.isDirty || loginMutation.isPending}
                className={
                  'bg-dodger-blue hover:bg-dodger-blue hover:opacity-80 disabled:pointer-events-auto disabled:cursor-not-allowed'
                }
              >
                {loginMutation.isPending ? <CircleLoading /> : 'Đăng nhập'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </BaseForm>
  );
}
