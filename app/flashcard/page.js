'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { db } from '@/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Card, CardActionArea, CardContent, Grid, Toolbar, Typography } from '@mui/material'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const router = useRouter()
    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>
    }

    return (
        <Container maxWidth="md">
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
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Box
                                    sx={{
                                        perspective: '1000px',
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.6s',
                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        cursor: 'pointer',
                                        minHeight: '150px', // Adjust this value as needed
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                    }}
                                    onClick={() => setFlipped(prev => ({ ...prev, [index]: !prev[index] }))}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '16px',
                                            '&:hover::after': {
                                                content: '"Click to turn"',
                                                position: 'absolute',
                                                bottom: '8px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                            },
                                        }}
                                    >
                                        <Typography variant="body1" align="center">{flashcard.front}</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '16px',
                                            '&:hover::after': {
                                                content: '"Click to turn"',
                                                position: 'absolute',
                                                bottom: '8px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                            },
                                        }}
                                    >
                                        <Typography variant="body1" align="center">{flashcard.back}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )


}