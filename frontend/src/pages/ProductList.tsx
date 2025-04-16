import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash.debounce';

const PAGE_SIZE = 20;
const LOAD_MORE_SIZE = 16;

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  // Use categories.json for category list
  const categoryNames = ['All', ...categories.map((c: any) => c.name)];

  // Fetch products from backend
  const fetchProducts = useCallback(async (reset = false, newSearch = search, newCategory = selectedCategory) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('offset', reset ? '0' : offset.toString());
    params.append('limit', reset ? PAGE_SIZE.toString() : LOAD_MORE_SIZE.toString());
    if (newSearch.trim()) params.append('search', newSearch.trim());
    if (newCategory !== 'All') {
      const cat = categories.find((c: any) => c.name === newCategory);
      if (cat && cat._id) params.append('category', cat._id);
    }
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(prev => reset ? data.products : [...prev, ...data.products]);
    setTotal(data.total);
    setHasMore((reset ? data.products.length : products.length + data.products.length) < data.total);
    setLoading(false);
    if (reset) setOffset(data.products.length);
    else setOffset(prev => prev + data.products.length);
  }, [offset, search, selectedCategory, categories, products.length]);

  // Initial load and on search/category change
  useEffect(() => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
    fetchProducts(true);
    // eslint-disable-next-line
  }, [search, selectedCategory]);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 300),
    []
  );

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Fallback colors
  const cardBg = 'white';
  const cardBorder = 'gray.200';

  return (
    <Box maxW="container.lg" mx="auto" mt={4} px={2}>
      <Heading as="h2" size="lg" mb={4}>
        Product List
      </Heading>
      <Input
        placeholder="Search products..."
        size="md"
        mb={4}
        onChange={e => handleSearch(e.target.value)}
      />
      <Box display="flex" gap={2} mb={6} overflowX="auto">
        {categoryNames.map((cat) => (
          <Button
            key={cat}
            colorScheme={selectedCategory === cat ? 'blue' : 'gray'}
            variant={selectedCategory === cat ? 'solid' : 'outline'}
            onClick={() => {
              setSelectedCategory(cat);
            }}
            fontWeight={600}
            textTransform="none"
            minW="90px"
          >
            {cat}
          </Button>
        ))}
      </Box>
      <motion.div
        key={selectedCategory + search}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <InfiniteScroll
          dataLength={products.length}
          next={() => fetchProducts(false)}
          hasMore={hasMore}
          loader={
            <Box textAlign="center" color="gray.400">
              <Spinner size="sm" mr={2}/>Loading more...
            </Box>
          }
          scrollThreshold={0.95}
        >
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
            <AnimatePresence>
              {products.map((product: any) => (
                <motion.div
                  key={product._id || product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <RouterLink to={`/products/${product._id || product.id}`} style={{ textDecoration: 'none' }}>
                    <Box
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={cardBorder}
                      borderRadius="xl"
                      boxShadow="md"
                      p={4}
                      h={"340px"}
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      position="relative"
                      _hover={{ boxShadow: 'xl', borderColor: 'blue.400', textDecoration: 'none' }}
                      transition="box-shadow 0.2s, border-color 0.2s"
                    >
                      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                        {product.image || (product.images && product.images[0]) ? (
                          <Box bg="gray.100" borderRadius="md" height="100px" width="180px" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
                            <img src={product.image || product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        ) : (
                          <Box bg="gray.100" borderRadius="md" height="100px" width="180px" display="flex" alignItems="center" justifyContent="center">
                            <Text color="gray.400">Image</Text>
                          </Box>
                        )}
                      </Box>
                      <Text fontWeight={700} mb={1}>
                        {product.name}
                      </Text>
                      <Box mb={2} px={2} py={1} bg="gray.100" borderRadius="md" fontWeight={500} fontSize="sm" w="fit-content">
                        {product.categoryName || (product.category && product.category.name)}
                      </Box>
                      <Text color="blue.500" fontWeight={700} fontSize="lg" mb={2}>
                        ${product.price}
                      </Text>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        w="full"
                        mt={2}
                        onClick={e => {
                          e.preventDefault();
                          dispatch(addToCart({ id: product._id || product.id, name: product.name, price: product.price }));
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </RouterLink>
                </motion.div>
              ))}
            </AnimatePresence>
          </SimpleGrid>
        </InfiniteScroll>
        {loading && <Box textAlign="center" color="gray.400"><Spinner size="sm" mr={2}/>Loading...</Box>}
      </motion.div>
    </Box>
  );
};

export default ProductList; 