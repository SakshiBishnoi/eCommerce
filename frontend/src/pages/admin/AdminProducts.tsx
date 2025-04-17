import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Flex, 
  Spinner, 
  Alert, 
  AlertIcon,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Select,
  useToast,
  Image,
  Text,
  Stack,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX } from 'react-icons/fi';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  categoryName?: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const toast = useToast();
  const bgHover = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/products?page=${page}&limit=20`);
      const data = await res.json();
      if (!res.ok) setError(data.message || 'Failed to fetch products');
      else {
        // Transform the data to ensure consistent structure
        const formattedProducts = (data.products || data).map((product: any) => ({
          ...product,
          categoryName: product.category?.name || 'Unknown',
          category: product.category?._id || product.category
        }));
        setProducts(formattedProducts);
        setTotalPages(Math.ceil(data.total / 20));
      }
    } catch (err) {
      setError('Failed to fetch products');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(Array.isArray(data.categories) ? data.categories : []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
      category: categories.length > 0 ? categories[0]._id : ''
    });
    setFormErrors({});
    onFormOpen();
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setFormErrors({});
    onFormOpen();
  };

  const handleDeletePrompt = (product: Product) => {
    setCurrentProduct(product);
    onDeleteOpen();
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!currentProduct?.name) {
      errors.name = 'Name is required';
    }
    
    if (!currentProduct?.description) {
      errors.description = 'Description is required';
    }
    
    if (!currentProduct?.price || currentProduct.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (!currentProduct?.category) {
      errors.category = 'Category is required';
    }
    
    if (currentProduct?.stock === undefined || currentProduct.stock < 0) {
      errors.stock = 'Stock must be 0 or greater';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProduct = async () => {
    if (!validateForm() || !currentProduct) return;
    
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const isEditing = !!currentProduct._id;
      const url = isEditing 
        ? `/api/products/${currentProduct._id}`
        : '/api/products';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentProduct)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      
      toast({
        title: isEditing ? 'Product updated' : 'Product created',
        status: 'success',
        duration: 3000
      });
      
      onFormClose();
      fetchProducts();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'An error occurred',
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct?._id) return;
    
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${currentProduct._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'An error occurred');
      }
      
      toast({
        title: 'Product deleted',
        status: 'success',
        duration: 3000
      });
      
      onDeleteClose();
      setProducts(products.filter(p => p._id !== currentProduct._id));
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'An error occurred',
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddImageUrl = () => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        images: [...(currentProduct.images || []), '']
      });
    }
  };

  const handleUpdateImageUrl = (index: number, value: string) => {
    if (currentProduct?.images) {
      const updatedImages = [...currentProduct.images];
      updatedImages[index] = value;
      setCurrentProduct({
        ...currentProduct,
        images: updatedImages
      });
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    if (currentProduct?.images) {
      const updatedImages = currentProduct.images.filter((_, i) => i !== index);
      setCurrentProduct({
        ...currentProduct,
        images: updatedImages
      });
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">Products</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        <Input 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" my={8}>
          <Spinner />
        </Flex>
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th isNumeric>Price</Th>
                <Th isNumeric>Stock</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map(product => (
                <Tr key={product._id} _hover={{ bg: bgHover }}>
                  <Td>
                    <Box 
                      w="50px" 
                      h="50px" 
                      bg="gray.100" 
                      borderRadius="md" 
                      overflow="hidden"
                    >
                      {product.images && product.images[0] ? (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          w="100%"
                          h="100%"
                          objectFit="cover"
                          fallback={<Box bg="gray.100" w="100%" h="100%" />}
                        />
                      ) : (
                        <Box bg="gray.100" w="100%" h="100%" />
                      )}
                    </Box>
                  </Td>
                  <Td fontWeight="medium">{product.name}</Td>
                  <Td>{product.categoryName}</Td>
                  <Td isNumeric>${product.price.toFixed(2)}</Td>
                  <Td isNumeric>
                    {product.stock} 
                    {product.stock <= 5 && product.stock > 0 && (
                      <Text as="span" color="orange.500" ml={1}>
                        (Low)
                      </Text>
                    )}
                    {product.stock === 0 && (
                      <Text as="span" color="red.500" ml={1}>
                        (Out of stock)
                      </Text>
                    )}
                  </Td>
                  <Td>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      variant="ghost" 
                      leftIcon={<FiEdit />}
                      mr={2}
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      colorScheme="red" 
                      variant="ghost" 
                      leftIcon={<FiTrash2 />}
                      onClick={() => handleDeletePrompt(product)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {filteredProducts.length === 0 && (
            <Box textAlign="center" my={8} color="gray.500">
              No products found.
            </Box>
          )}
        </Box>
      )}

      {/* Pagination Controls */}
      <Flex justify="center" mt={4} gap={2}>
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</Button>
        <Box px={3} py={1} fontWeight="bold">Page {page} of {totalPages}</Box>
        <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
      </Flex>

      {/* Product Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentProduct?._id ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isInvalid={!!formErrors.name}>
                <FormLabel>Product Name</FormLabel>
                <Input 
                  value={currentProduct?.name || ''} 
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                />
                {formErrors.name && <FormErrorMessage>{formErrors.name}</FormErrorMessage>}
              </FormControl>

              <FormControl isInvalid={!!formErrors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  value={currentProduct?.description || ''} 
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                />
                {formErrors.description && <FormErrorMessage>{formErrors.description}</FormErrorMessage>}
              </FormControl>

              <FormControl isInvalid={!!formErrors.category}>
                <FormLabel>Category</FormLabel>
                <Select 
                  value={currentProduct?.category || ''} 
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                >
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                {formErrors.category && <FormErrorMessage>{formErrors.category}</FormErrorMessage>}
              </FormControl>

              <Flex gap={4}>
                <FormControl isInvalid={!!formErrors.price} flex="1">
                  <FormLabel>Price ($)</FormLabel>
                  <NumberInput 
                    value={currentProduct?.price || 0} 
                    onChange={(value) => setCurrentProduct({...currentProduct, price: Number(value)})}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {formErrors.price && <FormErrorMessage>{formErrors.price}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={!!formErrors.stock} flex="1">
                  <FormLabel>Stock</FormLabel>
                  <NumberInput 
                    value={currentProduct?.stock || 0} 
                    onChange={(value) => setCurrentProduct({...currentProduct, stock: Number(value)})}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {formErrors.stock && <FormErrorMessage>{formErrors.stock}</FormErrorMessage>}
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel>Images</FormLabel>
                <Stack spacing={2}>
                  {currentProduct?.images?.map((image, index) => (
                    <Flex key={index} align="center">
                      <Input 
                        value={image} 
                        onChange={(e) => handleUpdateImageUrl(index, e.target.value)}
                        placeholder="Image URL"
                        mr={2}
                      />
                      <IconButton
                        aria-label="Remove image"
                        icon={<FiX />}
                        size="sm"
                        onClick={() => handleRemoveImageUrl(index)}
                      />
                    </Flex>
                  ))}
                  <Button size="sm" onClick={handleAddImageUrl} variant="outline">
                    Add Image URL
                  </Button>
                </Stack>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFormClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSaveProduct}
              isLoading={isSaving}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete <strong>{currentProduct?.name}</strong>? This action cannot be undone.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleDeleteProduct}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminProducts; 