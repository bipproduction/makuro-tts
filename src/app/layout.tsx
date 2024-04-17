import '@mantine/core/styles.css';
import { Button, ColorSchemeScript, Group, MantineProvider, Stack } from '@mantine/core';
import JotaiProvider from './_ui/jotai_provider';
import { cookies } from 'next/headers'
import prisma from '@/util/prisma';
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js';
import Login from './_ui/login';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = cookies();
  const email = AES.decrypt(cookie.get("token")?.value as any, "makuro").toString(CryptoJS.enc.Utf8)
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        {cookie.get("token")?.value}
        {
          <MantineProvider>
            <Stack gap={12}>
              <JotaiProvider user={user}>
                {cookie && cookie.get('token') && cookie.get('token')?.value ? children : <Login />}
              </JotaiProvider>
            </Stack>
          </MantineProvider>
        }
      </body>
    </html>
  );
}