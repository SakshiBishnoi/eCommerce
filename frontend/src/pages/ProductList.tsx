import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Input,
  Skeleton,
  SkeletonText,
  useToast,
  Flex,
  Tag,
  Image,
  Card,
  CardBody,
  CardFooter,
  HStack,
  useBreakpointValue,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  IconButton,
  Center,
  InputGroup,
  InputLeftElement,
  Spacer
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const PAGE_SIZE = 20;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const filterBg = useColorModeValue('white', 'gray.900');
  const filterInputBg = useColorModeValue('gray.50', 'gray.800');
  const categoryBarBg = useColorModeValue('white', 'gray.900');
  const categoryBarShadow = useColorModeValue('sm', 'dark-lg');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(PAGE_SIZE));
        if (search.trim()) params.append('search', search.trim());
        if (selectedCategory !== 'All') {
          const cat = categories.find((c: any) => c.name === selectedCategory);
          if (cat && cat._id) params.append('category', cat._id);
        }
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(Math.max(1, Math.ceil((data.total || 1) / PAGE_SIZE)));
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (err) {
        setError('Failed to fetch products');
        setProducts([]);
        setTotalPages(1);
      }
      setLoading(false);
    };
    fetchProducts();
    // eslint-disable-next-line
  }, [page, search, selectedCategory, categories]);

  // Memoize category names for filter buttons
  const categoryNames = useMemo(() => ['All', ...categories.map((c: any) => c.name)], [categories]);

  // Skeleton loaders
  const skeletonArray = Array.from({ length: isMobile ? 4 : 8 });

  // Category Bar
  const CategoryBar = (
    <Flex
      bg={categoryBarBg}
      boxShadow={categoryBarShadow}
      borderRadius="xl"
      px={2}
      py={2}
      mb={4}
      overflowX="auto"
      align="center"
      gap={2}
      w="full"
      maxW="container.xl"
      mx="auto"
      as="nav"
      aria-label="Product categories"
      sx={{
        '::-webkit-scrollbar': { height: '6px' },
        '::-webkit-scrollbar-thumb': { background: '#e2e8f0', borderRadius: '3px' },
      }}
    >
      {loading && categories.length === 0
        ? Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height="36px" width="90px" borderRadius="full" />
          ))
        : categoryNames.map((cat) => (
            <Button
              key={cat}
              colorScheme={selectedCategory === cat ? 'blue' : 'gray'}
              variant={selectedCategory === cat ? 'solid' : 'outline'}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              fontWeight={600}
              borderRadius="full"
              px={5}
              py={2}
              minW="90px"
              size="sm"
              boxShadow={selectedCategory === cat ? 'md' : undefined}
              transition="all 0.2s"
              _focus={{ boxShadow: 'outline' }}
              tabIndex={0}
              whiteSpace="nowrap"
            >
              {cat}
            </Button>
          ))}
      <Spacer minW={2} />
    </Flex>
  );

  // Search Bar
  const SearchBar = (
    <InputGroup maxW={{ base: '100%', md: '400px' }} mx="auto" mb={4}>
      <InputLeftElement pointerEvents="none">
        <FiSearch color="#A0AEC0" />
      </InputLeftElement>
      <Input
        placeholder="Search products..."
        size="lg"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        bg={filterInputBg}
        borderRadius="full"
        fontSize="md"
        boxShadow="sm"
      />
    </InputGroup>
  );

  // Mobile filter drawer (optional, not used here for simplicity)

  return (
    <Box maxW="container.xl" mx="auto" pt={{ base: 4, md: 8 }} px={{ base: 1, md: 4 }}>
      <Heading as="h1" size="xl" fontWeight="bold" letterSpacing="tight" mb={4} textAlign="left">
        Products
      </Heading>
      {SearchBar}
      {CategoryBar}
      {/* Product Grid */}
      {loading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} mt={2}>
          {skeletonArray.map((_, i) => (
            <Card key={i} borderRadius="2xl" boxShadow="md" p={0} bg={cardBg}>
              <Skeleton height="160px" borderTopRadius="2xl" />
              <CardBody>
                <SkeletonText mt="4" noOfLines={2} spacing="3" />
                <Skeleton height="20px" mt={2} w="60%" />
                <Skeleton height="24px" mt={4} w="80%" />
              </CardBody>
              <CardFooter>
                <Skeleton height="40px" w="full" borderRadius="md" />
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      ) : error ? (
        <Center mt={12}>
          <Text color="red.500" fontSize="lg">
            {error}
          </Text>
        </Center>
      ) : products.length === 0 ? (
        <Center mt={12}>
          <Text color="gray.500" fontSize="lg">
            No products found.
          </Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} mt={2}>
          {products.map((product: any) => (
            <MotionCard
              key={product._id || product.id}
              borderRadius="2xl"
              boxShadow="md"
              transition="box-shadow 0.2s, transform 0.2s"
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              p={0}
              bg={cardBg}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="gray.50"
                borderTopRadius="2xl"
                h="160px"
              >
                {product.image || (product.images && product.images[0]) ? (
                  <Image
                    src={product.image || product.images[0]}
                    alt={product.name}
                    borderRadius="md"
                    height="140px"
                    width="auto"
                    objectFit="cover"
                    mx="auto"
                  />
                ) : (
                  <Box
                    bg="gray.100"
                    borderRadius="md"
                    height="100px"
                    width="180px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.400">Image</Text>
                  </Box>
                )}
              </Box>
              <CardBody>
                <Text fontWeight={700} fontSize="lg" mb={1} noOfLines={1}>
                  {product.name}
                </Text>
                <Tag
                  mb={2}
                  colorScheme="blue"
                  borderRadius="full"
                  fontSize="sm"
                  px={3}
                  py={1}
                >
                  {product.categoryName || (product.category && product.category.name)}
                </Tag>
                <Text color="blue.500" fontWeight={700} fontSize="xl" mb={2}>
                  ${product.price}
                </Text>
              </CardBody>
              <CardFooter>
                <Button
                  as={RouterLink}
                  to={`/products/${product._id || product.id}`}
                  colorScheme="blue"
                  w="full"
                  borderRadius="md"
                  size="lg"
                  fontWeight="bold"
                >
                  View Details
                </Button>
              </CardFooter>
            </MotionCard>
          ))}
        </SimpleGrid>
      )}
      {/* Pagination Controls */}
      <Flex justify="center" mt={8} gap={2}>
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </Button>
        <Box px={3} py={1} fontWeight="bold">
          Page {page} of {totalPages}
        </Box>
        <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default ProductList; 