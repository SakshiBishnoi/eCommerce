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
  Badge,
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
  Input,
  Textarea,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Category {
  _id: string;
  name: string;
  description?: string;
  productCount: number;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const toast = useToast();
  const bgHover = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to fetch categories');
      } else {
        setCategories(data);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    }
    setLoading(false);
  };

  const handleAddCategory = () => {
    setCurrentCategory({
      name: '',
      description: '',
    });
    setFormErrors({});
    onFormOpen();
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setFormErrors({});
    onFormOpen();
  };

  const handleDeletePrompt = (category: Category) => {
    setCurrentCategory(category);
    onDeleteOpen();
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!currentCategory?.name) {
      errors.name = 'Name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCategory = async () => {
    if (!validateForm() || !currentCategory) return;
    
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const isEditing = !!currentCategory._id;
      const url = isEditing 
        ? `/api/categories/${currentCategory._id}`
        : '/api/categories';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentCategory)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      
      toast({
        title: isEditing ? 'Category updated' : 'Category created',
        status: 'success',
        duration: 3000
      });
      
      onFormClose();
      fetchCategories();
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

  const handleDeleteCategory = async () => {
    if (!currentCategory?._id) return;
    
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/categories/${currentCategory._id}`, {
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
        title: 'Category deleted',
        status: 'success',
        duration: 3000
      });
      
      onDeleteClose();
      setCategories(categories.filter(c => c._id !== currentCategory._id));
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

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">Categories</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={handleAddCategory}>
          Add Category
        </Button>
      </Flex>

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
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Products</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.map(category => (
                <Tr key={category._id} _hover={{ bg: bgHover }}>
                  <Td fontWeight="medium">{category.name}</Td>
                  <Td>{category.description || '-'}</Td>
                  <Td>
                    <Badge colorScheme={category.productCount > 0 ? "blue" : "gray"} borderRadius="full" px={2}>
                      {category.productCount} products
                    </Badge>
                  </Td>
                  <Td>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      variant="ghost" 
                      leftIcon={<FiEdit />}
                      mr={2}
                      onClick={() => handleEditCategory(category)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      colorScheme="red" 
                      variant="ghost" 
                      leftIcon={<FiTrash2 />}
                      onClick={() => handleDeletePrompt(category)}
                      isDisabled={category.productCount > 0}
                      title={category.productCount > 0 ? "Cannot delete categories with products" : ""}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {categories.length === 0 && (
            <Box textAlign="center" my={8} color="gray.500">
              No categories found.
            </Box>
          )}
        </Box>
      )}

      {/* Category Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentCategory?._id ? 'Edit Category' : 'Add New Category'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!formErrors.name} mb={4}>
              <FormLabel>Category Name</FormLabel>
              <Input 
                value={currentCategory?.name || ''} 
                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
              />
              {formErrors.name && <FormErrorMessage>{formErrors.name}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel>Description (Optional)</FormLabel>
              <Textarea 
                value={currentCategory?.description || ''} 
                onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFormClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSaveCategory}
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
          <ModalHeader>Delete Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete <strong>{currentCategory?.name}</strong>? This action cannot be undone.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleDeleteCategory}
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

export default AdminCategories; 