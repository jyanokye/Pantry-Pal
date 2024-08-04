'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore, auth } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Pexels API Key (Replace with your own API Key)
const PEXELS_API_KEY = 'UYJbox7J3zAWKTVoKeRe9H7MiyJw3VIgn1ltK4K6uyU736IUk3GhXMpw';

// Function to fetch image from Pexels
const fetchImageFromPexels = async (query) => {
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query: `${query}`,
        per_page: 1, // Number of images to return
      },
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });

    // Return the URL of the first image
    return response.data.photos.length > 0 ? response.data.photos[0].src.medium : '';
  } catch (error) {
    console.error('Error fetching image:', error);
    return '';
  }
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/signin'); // Redirect to sign-in if not authenticated
      } else {
        setUser(user);
        updateInventory(user.uid); // Update inventory when user is authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  const updateInventory = async (userId) => {
    const snapshot = query(collection(firestore, `users/${userId}/inventory`));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!user) return;
    const docRef = doc(collection(firestore, `users/${user.uid}/inventory`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      const imageUrl = await fetchImageFromPexels(item);
      await setDoc(docRef, { quantity: 1, imageUrl });
    }
    await updateInventory(user.uid);
  };

  const removeItem = async (item) => {
    if (!user) return;
    const docRef = doc(collection(firestore, `users/${user.uid}/inventory`), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory(user.uid);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={3}
      p={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: '#041690' }}>
        Add New Item
      </Button>
      <TextField
        id="search"
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2, maxWidth: '800px' }}
      />
      <Box width="100%" border={'1px solid #333'} borderRadius={2} overflow="hidden">
        <Box
          width="100%"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Box
          width="100%"
          height="auto"
          p={2}
          sx={{
            overflowY: 'auto',
            maxHeight: '500px',
          }}
        >
          <Stack 
            width="100%" 
            gap={2} 
            justifyContent={'center'} 
            flexDirection={'row'} 
            flexWrap="wrap"
            overflow={'auto'} 
            spacing={2}
            sx={{ mb: 10 }}
          >
            {filteredInventory.length > 0 ? (
              filteredInventory.map(({ name, quantity, imageUrl }) => (
                <Box
                  key={name}
                  width="300px"
                  height="auto"
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                  bgcolor={'#f0f0f0'}
                  padding={2}
                  borderRadius={1}
                  boxShadow={1}
                >
                  {imageUrl && <img src={imageUrl} alt={name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />}
                  <Typography variant={'h4'} color={'#333'} textAlign={'center'} mt={1}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h5'} color={'#333'} textAlign={'center'} mt={1}>
                    Quantity: {quantity}
                  </Typography>
                  <Button variant="contained" onClick={() => removeItem(name)} sx={{ mt: 1 , bgcolor: '#041690' }} >
                    Remove
                  </Button>
                </Box>
              ))
            ) : (
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={5}
              >
                <Typography variant="h4" color="text.primary" textAlign="center">
                  No items found
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
