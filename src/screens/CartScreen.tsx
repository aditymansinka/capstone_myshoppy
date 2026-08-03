import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SimpleImage from '../components/SimpleImage';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';

interface CartScreenProps {
  onContinueShopping: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

export const CartScreen: React.FC<CartScreenProps> = ({ onContinueShopping }) => {
  const { cart, updateQuantity, getTotalPrice, clearCart, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    console.log('[CartScreen] cart changed:', cart);
  }, [cart]);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', address: '', phone: '' });

  const validateOrderForm = () => {
    const nextErrors = { name: '', email: '', address: '', phone: '' };

    if (!name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }
    if (!address.trim()) {
      nextErrors.address = 'Please enter your address.';
    }
    if (!email.trim() || !emailRegex.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!phone.trim() || !phoneRegex.test(phone.trim())) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handlePlaceOrder = () => {
    if (!cart.length) {
      return;
    }

    if (!validateOrderForm()) {
      Alert.alert('Validation Failed', 'Please fill in all details correctly before placing your order.');
      return;
    }

    setSuccessModalVisible(true);
  };

  const handleModalClose = () => {
    setSuccessModalVisible(false);
    setName('');
    setEmail('');
    setAddress('');
    setPhone('');
    setErrors({ name: '', email: '', address: '', phone: '' });
    clearCart();
    onContinueShopping();
  };

  const confirmRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      'Remove item',
      `Are you sure you want to remove ${productName} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId) },
      ]
    );
  };

  const handleDecrease = (productId: string, productName: string, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(productId, -1);
      return;
    }

    Alert.alert(
      'Remove item',
      `Quantity for ${productName} is 1. Remove item from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId) },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Review Item And Shipping</Text>

          {cart.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is currently empty.</Text>
          ) : (
            cart.map(({ product, quantity }) => (
              <View key={product.id} style={styles.itemRow}>
                <SimpleImage uri={product.image} style={styles.itemImage} resizeMode="contain" />
                <View style={styles.itemDetails}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemName}>{product.name}</Text>
                    <TouchableOpacity onPress={() => confirmRemoveItem(product.id, product.name)}>
                      <Ionicons name="trash-outline" size={18} color="#DC2626" />
                    </TouchableOpacity>
                  </View>

                  {product.color && <Text style={styles.itemColor}>Color: {product.color}</Text>}

                  <View style={styles.quantityControls}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleDecrease(product.id, product.name, quantity)}>
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(product.id, 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.stockNotice}>
                    Only <Text style={styles.highlightText}>{product.stock} Items</Text> Left!
                  </Text>
                  <Text style={styles.stockSubNotice}>Don't miss it</Text>
                </View>

                <View style={styles.itemPriceContainer}>
                  <Text style={styles.itemPrice}>${(product.price * quantity).toFixed(2)}</Text>
                  <Text style={styles.itemQuantityMeta}>Quantity: {quantity < 10 ? `0${quantity}` : quantity}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {cart.length > 0 && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>Shipping Information</Text>
                <Text style={styles.formSubtitle}>Complete your delivery details to place the order.</Text>
              </View>
              <View style={styles.formBadge}>
                <Text style={styles.formBadgeText}>Secure checkout</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Full name</Text>
              <TextInput
                style={[styles.inputField, errors.name ? styles.inputError : null]}
                placeholder="Enter your name"
                placeholderTextColor="#788886"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
              {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <TextInput
                style={[styles.inputField, errors.email ? styles.inputError : null]}
                placeholder="Enter your email"
                placeholderTextColor="#788886"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
              />
              {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Shipping address</Text>
              <TextInput
                style={[styles.inputField, errors.address ? styles.inputError : null]}
                placeholder="Enter your address"
                placeholderTextColor="#788886"
                value={address}
                onChangeText={(value) => {
                  setAddress(value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                }}
              />
              {errors.address ? <Text style={styles.fieldError}>{errors.address}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Phone number</Text>
              <TextInput
                style={[styles.inputField, errors.phone ? styles.inputError : null]}
                placeholder="Enter your phone"
                placeholderTextColor="#788886"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
              />
              {errors.phone ? <Text style={styles.fieldError}>{errors.phone}</Text> : null}
            </View>
          </View>
        )}

        <View style={styles.totalSection}>
          <Text style={styles.totalTitle}>Total Price</Text>

          {cart.map(({ product, quantity }) => (
            <View key={product.id} style={styles.summaryRow}>
              <Text style={styles.summaryName}>{product.name}</Text>
              <Text style={styles.summaryQty}>{quantity}</Text>
              <Text style={styles.summaryPrice}>${(product.price * quantity).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.finalTotalRow}>
            <Text style={styles.totalText}>Total : ${getTotalPrice().toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.placeOrderBtn, cart.length === 0 && styles.disabledBtn]}
            onPress={handlePlaceOrder}
            disabled={cart.length === 0}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isSuccessModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successBadge}>
              <Ionicons name="checkmark" size={40} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Your order has been accepted</Text>
            <Text style={styles.transactionText}>Transaction ID: #F5062545820</Text>

            <TouchableOpacity style={styles.continueBtn} onPress={handleModalClose}>
              <Text style={styles.continueBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F8',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2E2B',
    marginBottom: 12,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 12,
  },
  formCard: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E6EDF0',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  formSubtitle: {
    fontSize: 12,
    color: '#5B6B6B',
    marginTop: 4,
    maxWidth: '72%',
  },
  formBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  formBadgeText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F3B36',
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#F7FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#1A2E2B',
    fontSize: 14,
  },
  inputError: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
  },
  fieldError: {
    color: '#B91C1C',
    fontSize: 12,
    marginTop: 6,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#12312B',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2E2B',
  },
  itemColor: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  stockNotice: {
    fontSize: 10,
    color: '#666',
    marginTop: 6,
  },
  highlightText: {
    color: '#D97706',
    fontWeight: '700',
  },
  stockSubNotice: {
    fontSize: 9,
    color: '#888',
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2E2B',
  },
  itemQuantityMeta: {
    fontSize: 10,
    color: '#777',
    marginTop: 4,
  },
  totalSection: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  totalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2E2B',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2E2B',
    flex: 2,
  },
  summaryQty: {
    fontSize: 14,
    color: '#1A2E2B',
    flex: 1,
    textAlign: 'center',
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2E2B',
    textAlign: 'right',
  },
  finalTotalRow: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#507677',
  },
  placeOrderBtn: {
    backgroundColor: '#507677',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'center',
    width: '60%',
  },
  disabledBtn: {
    backgroundColor: '#A0B2B3',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  successBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6EE7B7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2E2B',
    textAlign: 'center',
    marginBottom: 8,
  },
  transactionText: {
    fontSize: 10,
    color: '#777777',
    marginBottom: 20,
  },
  continueBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});