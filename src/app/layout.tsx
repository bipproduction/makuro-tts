import '@mantine/core/styles.css';
import { Button, ColorSchemeScript, Group, MantineProvider, Stack } from '@mantine/core';
import JotaiProvider from './_ui/jotai_provider';


export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        {
          <MantineProvider>
            <Stack gap={12}>
              <JotaiProvider>
                {children}
              </JotaiProvider>
            </Stack>
          </MantineProvider>
        }
      </body>
    </html>
  );
}