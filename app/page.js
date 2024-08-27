'use client';

import { AppBar, Box, Button, Card, CardContent, CardActions, Container, Grid, Toolbar, Typography } from "@mui/material";
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import getStripe from '@/utils/get-stripe'

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: window.location.origin },
    })
    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSessionJson.error) {
      console.warn(`Error: ${checkoutSessionJson.message}`)
      return
  }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="lg">
      <Head>
        <title>AI Flashcard</title>
        <meta name="description" content="Create flashcard from your prompt" />
      </Head>

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

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to AI Flashcard
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your prompt.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textDecoration: 'underline' }}>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>AI-Powered Generation</Typography>
            <Typography>Create flashcards instantly using advanced AI technology, saving you time and effort.</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>Customizable Decks</Typography>
            <Typography>Organize and tailor your flashcards into personalized decks for efficient studying.</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>Progress Tracking</Typography>
            <Typography>Monitor your learning progress with built-in analytics and performance metrics.</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textDecoration: 'underline' }}>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Free Plan
                </Typography>
                <Typography variant="h4" component="div" gutterBottom>
                  $0/month
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • Up to 50 flashcards
                  • Basic AI generation
                  • Community support
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth>
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Pro Plan
                </Typography>
                <Typography variant="h4" component="div" gutterBottom>
                  $19.99/month
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  or $199.99/year (Save 17%)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • Unlimited flashcards
                  • Advanced AI generation
                  • Priority support
                  • Progress tracking
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" onClick={() => handleSubmit()} fullWidth>
                  Choose Plan
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Enterprise Plan
                </Typography>
                <Typography variant="h4" component="div" gutterBottom>
                  $49.99/month
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  or $499.99/year (Save 17%)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  • Unlimited flashcards
                  • Premium AI generation
                  • 24/7 dedicated support
                  • Advanced analytics
                  • Team collaboration
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth>
                  Contact Sales
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
