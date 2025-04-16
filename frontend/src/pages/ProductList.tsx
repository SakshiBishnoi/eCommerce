import React, { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Skeleton,
  Input,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addToCart } from '../store';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import categories from '../categories.json';

const ProductList: React.FC = () => {
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();

  // Use categories.json for category list
  const categoryNames = useMemo(() => ['All', ...categories.map((c: any) => c.name)], []);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Filter products by selected category and search
  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === 'All'
      ? products
      : products.filter((p: any) => p.categoryName === selectedCategory);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter((p: any) =>
        p.name.toLowerCase().includes(s) ||
        p.categoryName.toLowerCase().includes(s)
      );
    }
    return filtered;
  }, [products, selectedCategory, search]);

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
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Box display="flex" gap={2} mb={6} overflowX="auto">
        {categoryNames.map((cat) => (
          <Button
            key={cat}
            colorScheme={selectedCategory === cat ? 'blue' : 'gray'}
            variant={selectedCategory === cat ? 'solid' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
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
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
          <AnimatePresence>
            {filteredProducts.map((product: any) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <RouterLink to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
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
                      {product.image ? (
                        <Box bg="gray.100" borderRadius="md" height="100px" width="180px" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                      {product.categoryName}
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
                        dispatch(addToCart({ id: product.id, name: product.name, price: product.price }));
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
      </motion.div>
    </Box>
  );
};

export default ProductList; 