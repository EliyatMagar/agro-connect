import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  FaBox,
  FaInfoCircle,
  FaLanguage,
  FaBalanceScale,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBoxes,
  FaLeaf,
  FaTree,
  FaSeedling,
  FaTractor
} from "react-icons/fa";

const FarmerProductById = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformProduct = (data) => ({
          id: data.ID || data.id,
          user_id: data.user_id,
          name_en: data.name_en,
          name_np: data.name_np,
          description_en: data.description_en,
          description_np: data.description_np,
          category: data.category,
          quantity: data.quantity,
          unit: data.unit,
          price_per_unit: data.price_per_unit,
          available_from: data.available_from,
          available_to: data.available_to,
          status: data.Status || data.status || "available",
          image_url: data.image_url,
          createdAt: data.CreatedAt || data.created_at,
          updatedAt: data.UpdatedAt || data.updated_at
        });

        const transformedProduct = transformProduct(response.data);
        setProduct(transformedProduct);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "available": return "success";
      case "sold": return "error";
      case "pending": return "warning";
      default: return "info";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{
          background: `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
          borderRadius: 2,
          m: 2
        }}
      >
        <FaLeaf size={isMobile ? 40 : 60} color={theme.palette.success.main} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{
          background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
          borderRadius: 2,
          m: 2
        }}
      >
        <Typography color="error" variant="h6" sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{
          background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
          borderRadius: 2,
          m: 2
        }}
      >
        <Typography variant="h6" sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
          Product not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: "0 auto", 
      p: { xs: 1, sm: 2, md: 3 },
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      borderRadius: 2
    }}>
      <Paper elevation={3} sx={{ 
        p: { xs: 1, sm: 2, md: 4 }, 
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
        background: 'rgba(255, 255, 255, 0.95)',
        overflow: 'hidden',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(to right, ${theme.palette.success.dark}, ${theme.palette.success.light})`
        }
      }}>
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          zIndex: 1
        }}>
          <FaTractor color={theme.palette.success.dark} size={isMobile ? 18 : 24} />
          <FaSeedling color={theme.palette.success.main} size={isMobile ? 18 : 24} />
          <FaLeaf color={theme.palette.primary.main} size={isMobile ? 18 : 24} />
        </Box>

        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ 
          fontWeight: 700,
          color: theme.palette.success.dark,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mt: isMobile ? 1 : 0,
          fontFamily: "'Merriweather', serif"
        }}>
          <FaLeaf color={theme.palette.success.main} size={isMobile ? 24 : 32} />
          Farmer's Product Details
        </Typography>
        
        <Divider sx={{ 
          my: isMobile ? 2 : 3,
          borderColor: theme.palette.grey[300],
          borderBottomWidth: 2,
          background: `linear-gradient(to right, transparent, ${theme.palette.success.light}, transparent)`
        }} />

        <Grid container spacing={isMobile ? 2 : 4}>
          {/* Product Image Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: "100%", 
              display: "flex", 
              flexDirection: "column",
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              border: `2px solid ${theme.palette.success.light}`
            }}>
              {product.image_url ? (
                <CardMedia
                  component="img"
                  height={isMobile ? "250" : isTablet ? "350" : "400"}
                  image={
                    product.image_url.startsWith('http') 
                      ? product.image_url 
                      : `http://localhost:8080${product.image_url}`
                  }
                  alt={product.name_en || "Product image"}
                  sx={{ 
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = `${window.location.origin}/placeholder-image.jpg`;
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: isMobile ? 250 : isTablet ? 350 : 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                    flexDirection: 'column',
                    gap: 2,
                    background: `linear-gradient(135deg, ${theme.palette.success.light}, ${theme.palette.primary.light})`
                  }}
                >
                  <FaBox size={isMobile ? 36 : 48} color={theme.palette.common.white} />
                  <Typography variant={isMobile ? "body1" : "h6"} color="common.white">
                    No Image Available
                  </Typography>
                </Box>
              )}
              <Box sx={{
                p: 2,
                bgcolor: theme.palette.success.light,
                textAlign: 'center'
              }}>
                <Typography variant="body2" color="common.white">
                  Farm Fresh Product
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* Product Details Section */}
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 0 }}>
              <Stack spacing={isMobile ? 2 : 3}>
                {/* Product Names */}
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    color: theme.palette.success.dark,
                    fontFamily: "'Merriweather', serif"
                  }}>
                    {product.name_en || "Unnamed Product"}
                  </Typography>
                  {product.name_np && (
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      color="text.secondary"
                      sx={{ 
                        fontFamily: "'Poppins', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <FaLanguage color={theme.palette.secondary.main} size={isMobile ? 14 : 16} />
                      {product.name_np}
                    </Typography>
                  )}
                </Box>

                {/* Status and Category Chips */}
                <Stack direction="row" spacing={2}>
                  <Chip
                    label={product.status || "unknown"}
                    color={getStatusColor(product.status)}
                    size={isMobile ? "small" : "medium"}
                    icon={<FaLeaf size={isMobile ? 12 : 14} />}
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                  {product.category && (
                    <Chip
                      label={product.category}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      icon={<FaSeedling size={isMobile ? 12 : 14} />}
                      sx={{ 
                        borderColor: theme.palette.success.light,
                        fontFamily: "'Poppins', sans-serif"
                      }}
                    />
                  )}
                </Stack>

                {/* Descriptions */}
                <Box>
                  <Typography variant={isMobile ? "body1" : "subtitle1"} sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: theme.palette.success.dark,
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    <FaInfoCircle color={theme.palette.success.main} size={isMobile ? 14 : 16} />
                    Description (English)
                  </Typography>
                  <Typography variant="body1" paragraph sx={{
                    p: isMobile ? 1 : 2,
                    bgcolor: 'rgba(144, 238, 144, 0.1)',
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette.success.light}`,
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    fontFamily: "'Open Sans', sans-serif"
                  }}>
                    {product.description_en || "No description available"}
                  </Typography>

                  {product.description_np && (
                    <>
                      <Typography variant={isMobile ? "body1" : "subtitle1"} sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: theme.palette.success.dark,
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        <FaLanguage color={theme.palette.secondary.main} size={isMobile ? 14 : 16} />
                        Description (Nepali)
                      </Typography>
                      <Typography variant="body1" paragraph sx={{
                        p: isMobile ? 1 : 2,
                        bgcolor: 'rgba(173, 216, 230, 0.1)',
                        borderRadius: 2,
                        borderLeft: `4px solid ${theme.palette.secondary.light}`,
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        fontFamily: "'Open Sans', sans-serif"
                      }}>
                        {product.description_np}
                      </Typography>
                    </>
                  )}
                </Box>

                <Divider sx={{ 
                  borderColor: theme.palette.grey[300],
                  borderBottomWidth: 1,
                  background: `linear-gradient(to right, transparent, ${theme.palette.success.light}, transparent)`
                }} />

                {/* Product Details Grid */}
                <Grid container spacing={isMobile ? 1 : 2}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{
                      p: isMobile ? 1 : 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(100, 221, 23, 0.05)',
                      border: `1px solid ${theme.palette.success.light}`,
                      height: '100%'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FaBalanceScale color={theme.palette.success.dark} size={isMobile ? 16 : 20} />
                        <Box>
                          <Typography variant={isMobile ? "caption" : "subtitle2"} color="text.secondary">
                            Quantity
                          </Typography>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight={500}>
                            {product.quantity || 0} {product.unit || ""}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{
                      p: isMobile ? 1 : 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(76, 175, 80, 0.05)',
                      border: `1px solid ${theme.palette.success.light}`,
                      height: '100%'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FaMoneyBillWave color={theme.palette.success.dark} size={isMobile ? 16 : 20} />
                        <Box>
                          <Typography variant={isMobile ? "caption" : "subtitle2"} color="text.secondary">
                            Price
                          </Typography>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight={500}>
                            Rs. {product.price_per_unit || 0} per {product.unit || "unit"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{
                      p: isMobile ? 1 : 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 193, 7, 0.05)',
                      border: `1px solid ${theme.palette.warning.light}`,
                      height: '100%'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FaCalendarAlt color={theme.palette.warning.dark} size={isMobile ? 16 : 20} />
                        <Box>
                          <Typography variant={isMobile ? "caption" : "subtitle2"} color="text.secondary">
                            Available From
                          </Typography>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight={500}>
                            {formatDate(product.available_from) || "Not specified"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{
                      p: isMobile ? 1 : 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 193, 7, 0.05)',
                      border: `1px solid ${theme.palette.warning.light}`,
                      height: '100%'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FaCalendarAlt color={theme.palette.warning.dark} size={isMobile ? 16 : 20} />
                        <Box>
                          <Typography variant={isMobile ? "caption" : "subtitle2"} color="text.secondary">
                            Available To
                          </Typography>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight={500}>
                            {formatDate(product.available_to) || "Not specified"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{
                      p: isMobile ? 1 : 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(158, 158, 158, 0.05)',
                      border: `1px solid ${theme.palette.grey[400]}`,
                      height: '100%'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FaBoxes color={theme.palette.grey[600]} size={isMobile ? 16 : 20} />
                        <Box>
                          <Typography variant={isMobile ? "caption" : "subtitle2"} color="text.secondary">
                            Created At
                          </Typography>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight={500}>
                            {formatDate(product.createdAt)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{
                      p: isMobile ? 1 : 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(158, 158, 158, 0.05)',
                      border: `1px solid ${theme.palette.grey[400]}`,
                      height: '100%'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FaBoxes color={theme.palette.grey[600]} size={isMobile ? 16 : 20} />
                        <Box>
                          <Typography variant={isMobile ? "caption" : "subtitle2"} color="text.secondary">
                            Last Updated
                          </Typography>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight={500}>
                            {formatDate(product.updatedAt)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FarmerProductById;