'use client'

import { useState } from 'react'
import db from '@/firebase'
import {
  AppBar,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Toolbar,
  Button,
  Typography,
  Box,
} from '@mui/material'
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';

export default function Generate() {
  const { isSignedIn, user } = useUser()
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [flipped, setFlipped] = useState({});

  const router = useRouter();
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    if (!isSignedIn) {
      alert('Please sign in to save flashcards.')
      return
    }

    try {
      const batch = writeBatch(db)
      const userDocRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        if (collections.find((f) => f.name === setName)) {
          alert('A flashcard set with the same name already exists.')
          return
        } else {
          collections.push({ name: setName })
          batch.update(userDocRef, { flashcards: collections }, {merge: true})
        }
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
      }

      const colRef = collection(userDocRef, setName)
      flashcards.forEach((flashcard) => {
        batch.set(doc(colRef), flashcard)
      })

      await batch.commit()

      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setSetName('')
      router.push('/flashcards')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
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
        </Box>
      )}

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Save Flashcards
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}