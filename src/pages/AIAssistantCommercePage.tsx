import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, TextField, Button, Avatar, Chip, Card, CardContent, CardActions, IconButton, Divider, Tabs, Tab, Snackbar, Alert, CircularProgress, InputAdornment, Badge, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Switch, FormControlLabel, Menu, MenuItem, Tooltip, LinearProgress, Slide
} from '@mui/material';
import { WhatsApp, Instagram, ShoppingCart, Search, Add, Edit, Delete, CheckCircle, LocalOffer, Star, StarBorder, ArrowForward, ArrowBack, ExpandMore, Close, Store, Category, FilterList, Payment, LocalShipping, Done, Warning, Favorite, FavoriteBorder, Info, EmojiObjects, Replay, MoreVert, Home, Person, Settings, Inventory, History, ShoppingBag, FlashOn, Bolt, TrendingUp, AttachMoney, Visibility, Save, ShoppingBasket, EmojiEmotions, EmojiEvents, EmojiFoodBeverage, EmojiNature, EmojiTransportation, EmojiPeople, EmojiSymbols } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';

// --- Mock Data Types ---
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  tags: string[];
  category: string;
  color: string;
  size: string[];
  stock: number;
  description: string;
  isNew?: boolean;
  isTrending?: boolean;
}

interface Order {
  id: string;
  productIds: string[];
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
  deliveryEta: string;
  trackingSteps: { label: string; completed: boolean; date?: string }[];
  total: number;
  address: string;
  customer: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  productIds?: string[];
  orderId?: string;
  typing?: boolean;
  suggestions?: string[];
}

// --- Mock Data ---
const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'White Sneakers',
    image: 'https://images.unsplash.com/photo-1517260911205-8c1e1a1b6b8c?auto=format&fit=crop&w=400&q=80',
    price: 89,
    tags: ['shoes', 'white', 'sneakers', 'trending'],
    category: 'Shoes',
    color: 'White',
    size: ['6', '7', '8', '9', '10', '11'],
    stock: 2,
    description: 'Crisp, clean, and ultra-comfy. The perfect white sneaker for any fit.',
    isTrending: true,
  },
  {
    id: 'p2',
    name: 'Classic Black Hoodie',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    price: 59,
    tags: ['hoodie', 'black', 'apparel', 'cozy'],
    category: 'Apparel',
    color: 'Black',
    size: ['S', 'M', 'L', 'XL'],
    stock: 8,
    description: 'Stay cozy and cool with this classic black hoodie. Soft fleece, Gen-Z approved.',
    isNew: true,
  },
  {
    id: 'p3',
    name: 'Pastel Crew Socks (3-pack)',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    price: 19,
    tags: ['socks', 'pastel', 'bundle', 'accessory'],
    category: 'Accessories',
    color: 'Multi',
    size: ['One Size'],
    stock: 12,
    description: 'Bundle up! 3 pairs of pastel crew socks for the perfect fit.',
  },
  {
    id: 'p4',
    name: 'Lilac Mini Bag',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    price: 39,
    tags: ['bag', 'lilac', 'accessory', 'trending'],
    category: 'Accessories',
    color: 'Lilac',
    size: ['One Size'],
    stock: 4,
    description: 'Statement mini bag in trending lilac. Fits your phone, gloss, and vibes.',
    isTrending: true,
  },
  {
    id: 'p5',
    name: 'Denim Bucket Hat',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    price: 25,
    tags: ['hat', 'denim', 'accessory', 'summer'],
    category: 'Accessories',
    color: 'Blue',
    size: ['One Size'],
    stock: 6,
    description: 'Denim bucket hat for sunny days and TikTok fits.',
  },
  {
    id: 'p6',
    name: 'Chunky Platform Sandals',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    price: 69,
    tags: ['sandals', 'platform', 'shoes', 'summer'],
    category: 'Shoes',
    color: 'Black',
    size: ['6', '7', '8', '9', '10'],
    stock: 3,
    description: 'Chunky platform sandals for max height and max style.',
  },
  {
    id: 'p7',
    name: 'Tie-Dye Tee',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    price: 29,
    tags: ['tee', 'tie-dye', 'apparel', 'colorful'],
    category: 'Apparel',
    color: 'Multi',
    size: ['S', 'M', 'L', 'XL'],
    stock: 10,
    description: 'Tie-dye tee for that retro Gen-Z energy.',
  },
  {
    id: 'p8',
    name: 'Neon Green Beanie',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    price: 15,
    tags: ['beanie', 'neon', 'accessory', 'winter'],
    category: 'Accessories',
    color: 'Neon Green',
    size: ['One Size'],
    stock: 1,
    description: 'Neon green beanie for max visibility and max vibes. Only 1 left!',
  },
];

const mockOrders: Order[] = [
  {
    id: 'o1',
    productIds: ['p1', 'p3'],
    status: 'Out for Delivery',
    createdAt: '2024-06-01T10:00:00Z',
    deliveryEta: '2024-06-04',
    trackingSteps: [
      { label: 'Order Placed', completed: true, date: '2024-06-01' },
      { label: 'Processing', completed: true, date: '2024-06-02' },
      { label: 'Shipped', completed: true, date: '2024-06-03' },
      { label: 'Out for Delivery', completed: true, date: '2024-06-04' },
      { label: 'Delivered', completed: false },
    ],
    total: 108,
    address: '123 Gen-Z Lane, LA, CA',
    customer: 'Taylor Swift',
  },
  {
    id: 'o2',
    productIds: ['p2'],
    status: 'Delivered',
    createdAt: '2024-05-20T14:00:00Z',
    deliveryEta: '2024-05-23',
    trackingSteps: [
      { label: 'Order Placed', completed: true, date: '2024-05-20' },
      { label: 'Processing', completed: true, date: '2024-05-21' },
      { label: 'Shipped', completed: true, date: '2024-05-22' },
      { label: 'Out for Delivery', completed: true, date: '2024-05-23' },
      { label: 'Delivered', completed: true, date: '2024-05-23' },
    ],
    total: 59,
    address: '123 Gen-Z Lane, LA, CA',
    customer: 'Taylor Swift',
  },
];

// --- Styled Components ---
const ChatBubble = styled(Box)<{ sender: 'user' | 'ai' }>(({ sender, theme }) => ({
  maxWidth: '80%',
  margin: sender === 'user' ? '8px 0 8px auto' : '8px auto 8px 0',
  background: sender === 'user'
    ? 'linear-gradient(90deg,#6366f1,#fbbf24)'
    : 'linear-gradient(90deg,#fff,#f3f4f6)',
  color: sender === 'user' ? '#fff' : '#222',
  borderRadius: sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  boxShadow: '0 2px 12px #6366f133',
  padding: '12px 18px',
  fontSize: 17,
  position: 'relative',
  wordBreak: 'break-word',
  fontFamily: 'Manrope, Inter, sans-serif',
  animation: 'fadeIn 0.5s',
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0',
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: 18,
  boxShadow: '0 4px 24px #6366f122',
  background: 'rgba(255,255,255,0.95)',
  transition: 'transform 0.2s',
  '&:hover': { transform: 'scale(1.04)' },
}));

const InventoryPanel = styled(Paper)(({ theme }) => ({
  borderRadius: 18,
  background: 'rgba(255,255,255,0.85)',
  boxShadow: '0 2px 16px #6366f122',
  padding: 24,
  marginBottom: 24,
}));

const OrderStatusStep = styled(Box)<{ active?: boolean; completed?: boolean }>(({ active, completed, theme }) => ({
  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
  color: completed ? theme.palette.success.main : active ? theme.palette.primary.main : '#bbb',
  fontWeight: completed ? 700 : 500,
}));

// --- Main Component ---
const AIAssistantCommercePage: React.FC = () => {
  // State
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      sender: 'ai',
      text: 'Hey Taylor 👋 Welcome back! What are you shopping for today?',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Show me trending',
        'Looking for white sneakers',
        'What are your bestsellers?',
        'Order status',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductCarousel, setShowProductCarousel] = useState(false);
  const [showOrderTracker, setShowOrderTracker] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [filter, setFilter] = useState<{ category: string; color: string; size: string; search: string }>({ category: '', color: '', size: '', search: '' });
  const [saved, setSaved] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [previewAIResponse, setPreviewAIResponse] = useState('');

  // --- Helper Functions ---
  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, typing]);

  // ... (rest of the main component: chat handler, product discovery, AI response simulation, product carousel, order tracker, admin, inventory, etc.)

  // Handler: Send message in chat
  const handleSend = (msg: string) => {
    if (!msg.trim()) return;
    setChat(prev => [
      ...prev,
      {
        id: uuidv4(),
        sender: 'user',
        text: msg,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      // Simulate AI response
      const aiMsg = simulateAIResponse(msg);
      setChat(prev => [
        ...prev,
        aiMsg,
      ]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  // Handler: Simulate AI response (move inside component to access products, saved)
  const simulateAIResponse = (msg: string): ChatMessage => {
    const m = msg.toLowerCase();
    if (m.includes('white sneakers')) {
      return {
        id: uuidv4(),
        sender: 'ai',
        text: 'Here are our top 3 white sneakers! Want to see a lookbook or buy now? 👟✨',
        timestamp: new Date().toISOString(),
        productIds: ['p1'],
        suggestions: ['Show lookbook', 'Buy', 'What else is trending?'],
      };
    }
    if (m.includes('order status') || m.includes('track')) {
      return {
        id: uuidv4(),
        sender: 'ai',
        text: "Here's your latest order. Want to track delivery or reorder? 📦",
        timestamp: new Date().toISOString(),
        orderId: orders[0]?.id,
        suggestions: ['Track order', 'Reorder', 'Show all orders'],
      };
    }
    if (m.includes('bundle') || m.includes('socks')) {
      return {
        id: uuidv4(),
        sender: 'ai',
        text: 'Bundle deal: White Sneakers + Pastel Crew Socks for $99! 🧦👟',
        timestamp: new Date().toISOString(),
        productIds: ['p1', 'p3'],
        suggestions: ['Buy bundle', 'Show more bundles'],
      };
    }
    if (m.includes('buy')) {
      return {
        id: uuidv4(),
        sender: 'ai',
        text: 'Ready to buy? Tap the Buy Now button below to checkout securely. 💳',
        timestamp: new Date().toISOString(),
        productIds: ['p1'],
        suggestions: ['Show payment link', 'Show more products'],
      };
    }
    if (m.includes('trending')) {
      return {
        id: uuidv4(),
        sender: 'ai',
        text: 'Trending now: Lilac Mini Bag, White Sneakers, and Neon Green Beanie! 🔥',
        timestamp: new Date().toISOString(),
        productIds: ['p4', 'p1', 'p8'],
        suggestions: ['Buy Lilac Mini Bag', 'Show all trending'],
      };
    }
    if (m.includes('lookbook')) {
      return {
        id: uuidv4(),
        sender: 'ai',
        text: "Here's your personalized lookbook! Swipe through the carousel 👉",
        timestamp: new Date().toISOString(),
        productIds: products.slice(0, 5).map(p => p.id),
        suggestions: ['Buy', 'Save for later'],
      };
    }
    if (m.includes('saved')) {
      return {
        id: uuidv4(),
        sender: 'ai',
        text: 'Here are your saved products. Want to buy or remove any?',
        timestamp: new Date().toISOString(),
        productIds: saved,
        suggestions: ['Buy all', 'Remove all'],
      };
    }
    // Default fallback
    return {
      id: uuidv4(),
      sender: 'ai',
      text: 'I can help you shop, track orders, or suggest bundles! Try: "Looking for white sneakers" or "Order status"',
      timestamp: new Date().toISOString(),
      suggestions: ['Show trending', 'Show bundles', 'Order status'],
    };
  };

  // Handler: Buy product
  const handleBuy = (product: Product) => {
    setSnackbar({ open: true, message: `Buy link for ${product.name} generated!`, severity: 'success' });
    setChat(prev => [
      ...prev,
      {
        id: uuidv4(),
        sender: 'ai',
        text: `Here's your secure payment link for ${product.name}:`,
        timestamp: new Date().toISOString(),
        suggestions: ['Track order', 'Show more products'],
      },
    ]);
  };

  // Handler: Save product
  const handleSave = (pid: string) => {
    if (!saved.includes(pid)) setSaved(prev => [...prev, pid]);
  };

  // Handler: Unsave product
  const handleUnsave = (pid: string) => {
    setSaved(prev => prev.filter(id => id !== pid));
  };

  // Handler: Delete product (admin)
  const handleDeleteProduct = (pid: string) => {
    setProducts(prev => prev.filter(p => p.id !== pid));
    setSnackbar({ open: true, message: 'Product deleted.', severity: 'info' });
  };

  // Handler: Add product (admin, mock)
  const handleAddProduct = () => {
    const newProduct: Product = {
      id: uuidv4(),
      name: 'New Gen-Z Tee',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      price: 35,
      tags: ['tee', 'new', 'gen-z'],
      category: 'Apparel',
      color: 'Multi',
      size: ['S', 'M', 'L', 'XL'],
      stock: 7,
      description: 'A fresh tee for your next TikTok.',
      isNew: true,
    };
    setProducts(prev => [newProduct, ...prev]);
    setSnackbar({ open: true, message: 'Product added!', severity: 'success' });
  };

  // Handler: Preview AI (admin)
  const handlePreviewAI = (msg: string) => {
    setPreviewAIResponse('Thinking...');
    setTimeout(() => {
      setPreviewAIResponse(simulateAIResponse(msg).text);
    }, 800);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', fontFamily: 'Manrope, Inter, sans-serif', p: { xs: 1, md: 4 } }}>
      {/* Top Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" sx={{ width: 48, height: 48, border: '2px solid #6366f1' }} />
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, color: '#3b3b5c' }}>
          AI Commerce Engine <span role="img" aria-label="zap">⚡</span>
        </Typography>
        <Chip icon={<WhatsApp />} label="WhatsApp" sx={{ bgcolor: '#25D366', color: '#fff', fontWeight: 700, fontSize: 15 }} />
        <Chip icon={<Instagram />} label="Instagram" sx={{ bgcolor: '#E1306C', color: '#fff', fontWeight: 700, fontSize: 15 }} />
        <Box sx={{ flexGrow: 1 }} />
        <Button startIcon={<Store />} onClick={() => setShowInventory(v => !v)} sx={{ fontWeight: 700, color: '#6366f1' }}>Inventory</Button>
        <Button startIcon={<History />} onClick={() => setShowOrderTracker(true)} sx={{ fontWeight: 700, color: '#6366f1' }}>Orders</Button>
        <Button startIcon={<Settings />} onClick={() => setShowAdmin(true)} sx={{ fontWeight: 700, color: '#6366f1' }}>Admin</Button>
      </Box>
      {/* --- Main Content Grid --- */}
      <Grid container spacing={3}>
        {/* --- Left: Chat Simulator --- */}
        <Grid item xs={12} md={7} lg={6}>
          <Paper elevation={4} sx={{ borderRadius: 5, p: { xs: 1, md: 3 }, minHeight: 540, background: 'rgba(255,255,255,0.95)', boxShadow: '0 8px 32px #6366f133', display: 'flex', flexDirection: 'column', height: { xs: 500, md: 650 }, position: 'relative' }}>
            {/* Chat Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />
              <Typography fontWeight={700} fontSize={18}>@AICartBot</Typography>
              <Chip icon={<Bolt />} label="AI Assistant" sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, ml: 1 }} />
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => setShowProductCarousel(true)}><ShoppingBag sx={{ color: '#6366f1' }} /></IconButton>
              <IconButton onClick={() => setShowOrderTracker(true)}><LocalShipping sx={{ color: '#6366f1' }} /></IconButton>
            </Box>
            <Divider sx={{ mb: 1 }} />
            {/* Chat Thread */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 2 }}>
              {chat.map((msg, i) => (
                <Box key={msg.id} display="flex" flexDirection="column" alignItems={msg.sender === 'user' ? 'flex-end' : 'flex-start'}>
                  <ChatBubble sender={msg.sender}>
                    {msg.text}
                    {/* Product bundle/upsell preview in chat */}
                    {msg.productIds && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        {msg.productIds.map(pid => {
                          const p = products.find(pr => pr.id === pid);
                          return p ? (
                            <Chip
                              key={p.id}
                              avatar={<Avatar src={p.image} />}
                              label={p.name}
                              sx={{ bgcolor: '#fbbf24', color: '#222', fontWeight: 700 }}
                            />
                          ) : null;
                        })}
                      </Box>
                    )}
                    {/* Buy link in chat */}
                    {msg.productIds && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 1, bgcolor: '#6366f1', color: '#fff', borderRadius: 3, fontWeight: 700 }}
                        onClick={() => {
                          setSelectedProduct(products.find(p => p.id === msg.productIds![0]) || null);
                          setShowProductCarousel(true);
                        }}
                      >
                        Buy Now
                      </Button>
                    )}
                    {/* Order status in chat */}
                    {msg.orderId && (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1, borderRadius: 3, fontWeight: 700 }}
                        onClick={() => {
                          setSelectedOrder(orders.find(o => o.id === msg.orderId) || null);
                          setShowOrderTracker(true);
                        }}
                      >
                        Track Order
                      </Button>
                    )}
                  </ChatBubble>
                  {/* AI Suggestions */}
                  {msg.suggestions && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      {msg.suggestions.map(s => (
                        <Chip
                          key={s}
                          label={s}
                          onClick={() => handleSend(s)}
                          sx={{ bgcolor: '#e0e7ff', color: '#6366f1', fontWeight: 700, cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
              {typing && (
                <TypingIndicator>
                  <CircularProgress size={18} sx={{ color: '#6366f1' }} />
                  <Typography fontSize={15} color="#6366f1">AICartBot is typing…</Typography>
                </TypingIndicator>
              )}
              <div ref={chatEndRef} />
            </Box>
            {/* Chat Input */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message… (e.g. 'Looking for white sneakers')"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(input); }}
                sx={{ borderRadius: 3, background: '#f3f4f6', fontWeight: 500 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmojiEmotions sx={{ color: '#6366f1' }} /></InputAdornment>,
                }}
              />
              <Button
                variant="contained"
                sx={{ bgcolor: '#6366f1', color: '#fff', borderRadius: 3, fontWeight: 700, px: 3 }}
                onClick={() => handleSend(input)}
                disabled={!input.trim() || typing}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>
        {/* --- Right: Product Carousel, Saved, Inventory, Admin, Order Tracker --- */}
        <Grid item xs={12} md={5} lg={6}>
          {/* Product Carousel (Live Preview) */}
          <Collapse in={showProductCarousel}>
            <Paper elevation={6} sx={{ borderRadius: 5, p: 2, mb: 2, background: 'rgba(255,255,255,0.98)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={800} color="#6366f1">Product Lookbook</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton onClick={() => setShowProductCarousel(false)}><Close /></IconButton>
              </Box>
              <Grid container spacing={2}>
                {products.filter(p => p.stock > 0).map(product => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard>
                      <CardContent>
                        <Badge
                          badgeContent={product.isTrending ? '🔥' : product.isNew ? '✨' : null}
                          color="secondary"
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                          <Avatar src={product.image} sx={{ width: 72, height: 72, mb: 1, mx: 'auto', border: '2px solid #6366f1' }} />
                        </Badge>
                        <Typography fontWeight={700} fontSize={17} sx={{ mb: 0.5 }}>{product.name}</Typography>
                        <Typography fontSize={15} color="#6366f1" fontWeight={600}>${product.price}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                          {product.tags.map(tag => (
                            <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#e0e7ff', color: '#6366f1', fontWeight: 700 }} />
                          ))}
                        </Box>
                        <Typography fontSize={13} color="#888" sx={{ mt: 1 }}>{product.description}</Typography>
                        {product.stock <= 2 && (
                          <Chip label={`Only ${product.stock} left!`} color="warning" size="small" sx={{ mt: 1, fontWeight: 700 }} />
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ bgcolor: '#6366f1', color: '#fff', borderRadius: 3, fontWeight: 700 }}
                          onClick={() => handleBuy(product)}
                        >
                          Buy
                        </Button>
                        <IconButton onClick={() => handleSave(product.id)}>
                          {saved.includes(product.id) ? <Favorite sx={{ color: '#fbbf24' }} /> : <FavoriteBorder />}
                        </IconButton>
                      </CardActions>
                    </ProductCard>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Collapse>
          {/* Saved for Later */}
          <Paper elevation={2} sx={{ borderRadius: 5, p: 2, mb: 2, background: 'rgba(255,255,255,0.95)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Favorite sx={{ color: '#fbbf24', mr: 1 }} />
              <Typography fontWeight={700}>Saved for Later</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {saved.length === 0 && <Typography color="#bbb">No saved products yet.</Typography>}
              {saved.map(pid => {
                const p = products.find(pr => pr.id === pid);
                return p ? (
                  <Chip
                    key={p.id}
                    avatar={<Avatar src={p.image} />}
                    label={p.name}
                    onDelete={() => handleUnsave(p.id)}
                    sx={{ bgcolor: '#e0e7ff', color: '#6366f1', fontWeight: 700 }}
                  />
                ) : null;
              })}
            </Box>
          </Paper>
          {/* Inventory Panel */}
          <Collapse in={showInventory}>
            <InventoryPanel>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Inventory sx={{ color: '#6366f1', mr: 1 }} />
                <Typography fontWeight={800} color="#6366f1">Inventory</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton onClick={() => setShowInventory(false)}><Close /></IconButton>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Search"
                  size="small"
                  value={filter.search}
                  onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                  sx={{ minWidth: 120 }}
                  InputProps={{ startAdornment: <Search sx={{ color: '#6366f1' }} /> }}
                />
                <TextField
                  label="Category"
                  size="small"
                  select
                  value={filter.category}
                  onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {Array.from(new Set(products.map(p => p.category))).map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Color"
                  size="small"
                  select
                  value={filter.color}
                  onChange={e => setFilter(f => ({ ...f, color: e.target.value }))}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {Array.from(new Set(products.map(p => p.color))).map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {products.filter(p =>
                  (!filter.search || p.name.toLowerCase().includes(filter.search.toLowerCase())) &&
                  (!filter.category || p.category === filter.category) &&
                  (!filter.color || p.color === filter.color)
                ).map(product => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard>
                      <CardContent>
                        <Avatar src={product.image} sx={{ width: 56, height: 56, mb: 1, mx: 'auto', border: '2px solid #6366f1' }} />
                        <Typography fontWeight={700} fontSize={16}>{product.name}</Typography>
                        <Typography fontSize={14} color="#6366f1" fontWeight={600}>${product.price}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                          {product.tags.map(tag => (
                            <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#e0e7ff', color: '#6366f1', fontWeight: 700 }} />
                          ))}
                        </Box>
                        <Typography fontSize={12} color="#888" sx={{ mt: 1 }}>{product.description}</Typography>
                        {product.stock <= 2 && (
                          <Chip label={`Only ${product.stock} left!`} color="warning" size="small" sx={{ mt: 1, fontWeight: 700 }} />
                        )}
                      </CardContent>
                    </ProductCard>
                  </Grid>
                ))}
              </Grid>
            </InventoryPanel>
          </Collapse>
          {/* Order Tracker */}
          <Drawer anchor="right" open={showOrderTracker || !!selectedOrder} onClose={() => { setShowOrderTracker(false); setSelectedOrder(null); }}>
            <Box sx={{ width: { xs: 320, md: 400 }, p: 3, minHeight: 400 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShipping sx={{ color: '#6366f1', mr: 1 }} />
                <Typography fontWeight={800} color="#6366f1">Order Tracker</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton onClick={() => { setShowOrderTracker(false); setSelectedOrder(null); }}><Close /></IconButton>
              </Box>
              <Tabs value={selectedOrder ? 1 : 0} onChange={(_, v) => v === 0 ? setSelectedOrder(null) : null}>
                <Tab label="All Orders" />
                <Tab label="Details" disabled={!selectedOrder} />
              </Tabs>
              {!selectedOrder ? (
                <List>
                  {orders.map(order => (
                    <ListItem button key={order.id} onClick={() => setSelectedOrder(order)}>
                      <ListItemIcon><ShoppingBag sx={{ color: '#6366f1' }} /></ListItemIcon>
                      <ListItemText
                        primary={`Order #${order.id}`}
                        secondary={`Status: ${order.status} | Total: $${order.total}`}
                      />
                      <ArrowForward sx={{ color: '#6366f1' }} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box>
                  <Typography fontWeight={700} sx={{ mb: 1 }}>Order #{selectedOrder.id}</Typography>
                  <Typography fontSize={15} color="#6366f1">{selectedOrder.status}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography fontWeight={600}>Products:</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {selectedOrder.productIds.map(pid => {
                      const p = products.find(pr => pr.id === pid);
                      return p ? (
                        <Chip key={p.id} avatar={<Avatar src={p.image} />} label={p.name} />
                      ) : null;
                    })}
                  </Box>
                  <Typography fontWeight={600}>Delivery Progress:</Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedOrder.trackingSteps.map((step, idx) => (
                      <OrderStatusStep key={step.label} completed={step.completed} active={!step.completed && (selectedOrder.trackingSteps.findIndex(s => !s.completed) === idx)}>
                        {step.completed ? <CheckCircle fontSize="small" color="success" /> : <FlashOn fontSize="small" color="warning" />}
                        <span>{step.label}</span>
                        {step.date && <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{step.date}</span>}
                      </OrderStatusStep>
                    ))}
                  </Box>
                  <Typography fontWeight={600} sx={{ mt: 2 }}>Delivery ETA: <span style={{ color: '#6366f1' }}>{selectedOrder.deliveryEta}</span></Typography>
                  <Typography fontWeight={600}>Address: <span style={{ color: '#6366f1' }}>{selectedOrder.address}</span></Typography>
                </Box>
              )}
            </Box>
          </Drawer>
          {/* Admin Panel */}
          <Drawer anchor="right" open={showAdmin} onClose={() => setShowAdmin(false)}>
            <Box sx={{ width: { xs: 320, md: 400 }, p: 3, minHeight: 400 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Settings sx={{ color: '#6366f1', mr: 1 }} />
                <Typography fontWeight={800} color="#6366f1">Admin Panel</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton onClick={() => setShowAdmin(false)}><Close /></IconButton>
              </Box>
              <Tabs value={0}>
                <Tab label="Products" />
                <Tab label="Preview AI" />
              </Tabs>
              <Divider sx={{ my: 2 }} />
              <Typography fontWeight={700} sx={{ mb: 1 }}>Add/Edit Products</Typography>
              {/* For brevity, just show product list and allow delete */}
              <List>
                {products.map(product => (
                  <ListItem key={product.id}>
                    <ListItemIcon><Avatar src={product.image} /></ListItemIcon>
                    <ListItemText primary={product.name} secondary={`$${product.price}`} />
                    <IconButton onClick={() => handleDeleteProduct(product.id)}><Delete color="error" /></IconButton>
                  </ListItem>
                ))}
              </List>
              <Button startIcon={<Add />} variant="contained" sx={{ mt: 2, bgcolor: '#6366f1' }} onClick={handleAddProduct}>Add Product</Button>
              <Divider sx={{ my: 2 }} />
              <Typography fontWeight={700} sx={{ mb: 1 }}>Preview AI Response</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask the AI (e.g. 'Show me socks bundle')"
                onKeyDown={e => { if (e.key === 'Enter') handlePreviewAI((e.target as HTMLInputElement).value); }}
                sx={{ mb: 1 }}
              />
              <Paper sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: 3, minHeight: 60 }}>
                <Typography fontSize={15} color="#6366f1">{previewAIResponse}</Typography>
              </Paper>
            </Box>
          </Drawer>
          {/* Snackbar for notifications */}
          <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
            <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIAssistantCommercePage; 