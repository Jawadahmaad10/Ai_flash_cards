'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import getStripe from '@/utils/get-stripe'
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, CircularProgress, Toolbar, Typography } from '@mui/material'

const ResultPage = () => {
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return
      try {
        const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
        const sessionData = await res.json()
        if (res.ok) {
          setSession(sessionData)
        } else {
          setError(sessionData.error)
        }
      } catch (err) {
        setError('An error occurred while retrieving the session.')
      } finally {
        setLoading(false)
      }
    }
    fetchCheckoutSession()
  }, [session_id])

  const handlePayment = async () => {
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

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
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
      {session.payment_status === 'paid' ? (
        <>
          <Typography variant="h4">Thank you for your purchase!</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              We have received your payment. You will receive an email with the
              order details shortly.
            </Typography>
            <Button color="primary" sx={{ mt: 2, mr: 2 }} href="/">Return Home</Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment failed</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Your payment was not successful. Please try again.
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/">Return Home</Button>
            <Button variant="outlined" color="primary" sx={{ mt: 2, mr: 2 }} onClick={() => handlePayment()}>Retry Payment</Button>
          </Box>
        </>
      )}
    </Container>
  )
}

export default ResultPage;