import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { SignedIn, SignedOut, UserButton, SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
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
        <Typography variant="h4" sx={{ mb: 2 }}>Sign up</Typography>
        <SignUp />
      </Box>
    </Container>
  );
}