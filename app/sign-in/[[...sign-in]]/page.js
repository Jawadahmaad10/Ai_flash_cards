import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <Container maxWidth="sm">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            AI Flashcard
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>Login</Typography>
        <SignIn />
      </Box>
    </Container>
  );
}