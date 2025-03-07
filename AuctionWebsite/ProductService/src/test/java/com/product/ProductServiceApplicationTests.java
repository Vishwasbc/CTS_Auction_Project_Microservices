/*
 * package com.product;
 * 
 * import static org.junit.jupiter.api.Assertions.assertEquals; import static
 * org.junit.jupiter.api.Assertions.assertThrows; import static
 * org.mockito.Mockito.when;
 * 
 * import java.util.List; import java.util.Optional;
 * 
 * import org.junit.jupiter.api.BeforeEach; import org.junit.jupiter.api.Test;
 * import org.mockito.InjectMocks; import org.mockito.Mock; import
 * org.mockito.MockitoAnnotations;
 * 
 * import com.product.dto.ProductDTO; import com.product.dto.UserDTO; import
 * com.product.entity.Product; import com.product.entity.Status; import
 * com.product.exception.ProductNotFoundException; import
 * com.product.feign.UserClient; import
 * com.product.repository.ProductRepository; import
 * com.product.service.ProductIServiceImpl;
 * 
 * class ProductServiceImplTests {
 * 
 * @Mock private ProductRepository productRepository;
 * 
 * @Mock private UserClient userClient;
 * 
 * @InjectMocks private ProductIServiceImpl productService;
 * 
 * private Product product; private UserDTO userDTO;
 * 
 * @BeforeEach public void setUp() { MockitoAnnotations.openMocks(this); product
 * = new Product(1, "Product1", "Description1", 100.0,
 * "seller1",Status.PENDING); userDTO = new UserDTO("seller1", "Seller", "One",
 * "seller1@example.com","SELLER"); }
 * 
 * @Test void testGetAllProducts() {
 * when(productRepository.findAll()).thenReturn(List.of(product));
 * assertEquals(1, productService.getAllProducts().size()); }
 * 
 * @Test void testGetProductById_Success() {
 * when(productRepository.findById(1)).thenReturn(Optional.of(product));
 * assertEquals(product, productService.getProductById(1)); }
 * 
 * @Test void testGetProductById_NotFound() {
 * when(productRepository.findById(1)).thenReturn(Optional.empty());
 * assertThrows(ProductNotFoundException.class, () ->
 * productService.getProductById(1)); }
 * 
 * @Test void testSaveProduct_Success() {
 * when(userClient.getByUserName("seller1")).thenReturn(userDTO);
 * when(productRepository.save(product)).thenReturn(product);
 * assertEquals(product, productService.saveProduct(product)); }
 * 
 * @Test void testDeleteProduct_Success() { productService.deleteProduct(1);
 * assertEquals("Product Deleted", productService.deleteProduct(1)); }
 * 
 * @Test void testUpdateProduct_Success() {
 * when(userClient.getByUserName("seller1")).thenReturn(userDTO);
 * when(productRepository.findById(1)).thenReturn(Optional.of(product));
 * when(productRepository.save(product)).thenReturn(product);
 * assertEquals(product, productService.updateProduct(1, product)); }
 * 
 * @Test void testGetByProductId_Success() {
 * when(productRepository.findById(1)).thenReturn(Optional.of(product));
 * ProductDTO productDTO = new ProductDTO(1, "Product1", "Description1", 100.0,
 * "seller1","PENDING"); assertEquals(productDTO,
 * productService.getByProductId(1)); }
 * 
 * @Test void testGetByProductId_NotFound() {
 * when(productRepository.findById(1)).thenReturn(Optional.empty());
 * assertThrows(ProductNotFoundException.class, () ->
 * productService.getByProductId(1)); } }
 */