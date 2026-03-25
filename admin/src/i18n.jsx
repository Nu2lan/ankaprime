import { createContext, useContext, useState } from 'react'

const translations = {
    en: {
        // Sidebar & Layout
        dashboard: 'Dashboard', products: 'Products', categories: 'Categories',
        orders: 'Orders', users: 'Users', coupons: 'Coupons', signOut: 'Sign Out',
        adminPanel: 'Admin Panel', welcome: 'Welcome',

        // Dashboard
        totalOrders: 'Total Orders', revenue: 'Revenue', totalUsers: 'Total Users',
        lowStock: 'Low Stock', monthlySales: 'Monthly Sales', recentOrders: 'Recent Orders',
        noOrdersYet: 'No orders yet', orderId: 'Order ID', customer: 'Customer',
        total: 'Total', status: 'Status', date: 'Date',

        // Products
        addProduct: 'Add Product', searchProducts: 'Search products...',
        image: 'Image', title: 'Title', category: 'Category', price: 'Price',
        stock: 'Stock', actions: 'Actions', loading: 'Loading...', active: 'Active',
        inactive: 'Inactive', noProductsFound: 'No products found',
        deleteProduct: 'Delete this product?',

        // Product Form
        editProduct: 'Edit Product', createProduct: 'Create Product',
        oldPrice: 'Old Price', selectCategory: 'Select category',
        description: 'Description', images: 'Images', addImages: 'Add Images',
        uploading: 'Uploading...', clickToUpload: 'Click to upload images',
        imageFormats: 'JPG, PNG, GIF, WEBP — max 5MB each',
        attributes: 'Attributes', material: 'Material', color: 'Color',
        size: 'Size', brand: 'Brand', featured: 'Featured',
        saving: 'Saving...', updateProduct: 'Update Product', cancel: 'Cancel',
        min1Image: 'Please upload at least 1 image',
        titleAz: 'Title (AZ)', titleEn: 'Title (EN)', titleRu: 'Title (RU)',
        descAz: 'Description (AZ)', descEn: 'Description (EN)', descRu: 'Description (RU)',

        // Categories
        addCategory: 'Add Category', name: 'Name', slug: 'Slug',
        noCategories: 'No categories', update: 'Update', create: 'Create',
        nameAz: 'Name (AZ)', nameEn: 'Name (EN)', nameRu: 'Name (RU)',
        descriptionLabel: 'Description',

        // Orders
        search: 'Search', allStatuses: 'All Statuses', noOrdersFound: 'No orders found',
        orderIdOrCustomer: 'Order ID or customer name...', items: 'Items',

        // Order Detail
        updateStatus: 'Update Status', shippingAddress: 'Shipping Address',
        paymentSummary: 'Payment Summary', subtotal: 'Subtotal', discount: 'Discount',
        delivery: 'Delivery', orderNotFound: 'Order not found',

        // Users
        addAdmin: 'Add Admin', adminPanelTab: 'Admin Panel', customers: 'Customers',
        fullName: 'Full Name', email: 'Email', phone: 'Phone', role: 'Role',
        joined: 'Joined', you: 'You', removeAdmin: 'Remove Admin',
        noAdminUsers: 'No admin users', noCustomerUsers: 'No customer users',
        password: 'Password', newPassword: 'New Password', leaveBlankToKeep: 'Leave blank to keep',

        // Coupons
        addCoupon: 'Add Coupon', code: 'Code', type: 'Type', value: 'Value',
        minOrder: 'Min Order', expires: 'Expires', noCoupons: 'No coupons',
        percent: 'Percent (%)', fixed: 'Fixed ($)', never: 'Never',

        // Login
        signIn: 'Sign In', signingIn: 'Signing in...', adminAccessRequired: 'Admin access required',

        // Common
        delete: 'Delete', edit: 'Edit', confirm: 'Confirm', success: 'Success',
        failed: 'Failed', created: 'Created', updated: 'Updated', deleted: 'Deleted',
    },
    az: {
        dashboard: 'İdarə paneli', products: 'Məhsullar', categories: 'Kateqoriyalar',
        orders: 'Sifarişlər', users: 'İstifadəçilər', coupons: 'Kuponlar', signOut: 'Çıxış',
        adminPanel: 'Admin Panel', welcome: 'Xoş gəldiniz',

        totalOrders: 'Ümumi Sifarişlər', revenue: 'Gəlir', totalUsers: 'Ümumi İstifadəçilər',
        lowStock: 'Az Stok', monthlySales: 'Aylıq Satışlar', recentOrders: 'Son Sifarişlər',
        noOrdersYet: 'Hələ sifariş yoxdur', orderId: 'Sifariş ID', customer: 'Müştəri',
        total: 'Cəmi', status: 'Status', date: 'Tarix',

        addProduct: 'Məhsul Əlavə Et', searchProducts: 'Məhsul axtar...',
        image: 'Şəkil', title: 'Başlıq', category: 'Kateqoriya', price: 'Qiymət',
        stock: 'Stok', actions: 'Əməliyyatlar', loading: 'Yüklənir...', active: 'Aktiv',
        inactive: 'Deaktiv', noProductsFound: 'Məhsul tapılmadı',
        deleteProduct: 'Bu məhsulu silmək istəyirsiniz?',

        editProduct: 'Məhsulu Redaktə Et', createProduct: 'Məhsul Yarat',
        oldPrice: 'Köhnə Qiymət', selectCategory: 'Kateqoriya seçin',
        description: 'Təsvir', images: 'Şəkillər', addImages: 'Şəkil Əlavə Et',
        uploading: 'Yüklənir...', clickToUpload: 'Şəkil yükləmək üçün klikləyin',
        imageFormats: 'JPG, PNG, GIF, WEBP — maks 5MB',
        attributes: 'Xüsusiyyətlər', material: 'Material', color: 'Rəng',
        size: 'Ölçü', brand: 'Brend', featured: 'Seçilmiş',
        saving: 'Saxlanılır...', updateProduct: 'Məhsulu Yenilə', cancel: 'Ləğv et',
        min1Image: 'Ən azı 1 şəkil yükləyin',
        titleAz: 'Başlıq (AZ)', titleEn: 'Başlıq (EN)', titleRu: 'Başlıq (RU)',
        descAz: 'Təsvir (AZ)', descEn: 'Təsvir (EN)', descRu: 'Təsvir (RU)',

        addCategory: 'Kateqoriya Əlavə Et', name: 'Ad', slug: 'Slug',
        noCategories: 'Kateqoriya yoxdur', update: 'Yenilə', create: 'Yarat',
        nameAz: 'Ad (AZ)', nameEn: 'Ad (EN)', nameRu: 'Ad (RU)',
        descriptionLabel: 'Təsvir',

        search: 'Axtar', allStatuses: 'Bütün Statuslar', noOrdersFound: 'Sifariş tapılmadı',
        orderIdOrCustomer: 'Sifariş ID və ya müştəri adı...', items: 'Məhsullar',

        updateStatus: 'Statusu Yenilə', shippingAddress: 'Çatdırılma Ünvanı',
        paymentSummary: 'Ödəniş Xülasəsi', subtotal: 'Ara cəm', discount: 'Endirim',
        delivery: 'Çatdırılma', orderNotFound: 'Sifariş tapılmadı',

        addAdmin: 'Admin Əlavə Et', adminPanelTab: 'Admin Panel', customers: 'Müştərilər',
        fullName: 'Ad Soyad', email: 'E-poçt', phone: 'Telefon', role: 'Rol',
        joined: 'Qoşulub', you: 'Siz', removeAdmin: 'Admini Sil',
        noAdminUsers: 'Admin istifadəçi yoxdur', noCustomerUsers: 'Müştəri yoxdur',
        password: 'Şifrə', newPassword: 'Yeni Şifrə', leaveBlankToKeep: 'Saxlamaq üçün boş buraxın',

        addCoupon: 'Kupon Əlavə Et', code: 'Kod', type: 'Növ', value: 'Dəyər',
        minOrder: 'Min Sifariş', expires: 'Bitmə tarixi', noCoupons: 'Kupon yoxdur',
        percent: 'Faiz (%)', fixed: 'Sabit ($)', never: 'Heç vaxt',

        signIn: 'Daxil Ol', signingIn: 'Daxil olunur...', adminAccessRequired: 'Admin girişi tələb olunur',

        delete: 'Sil', edit: 'Redaktə', confirm: 'Təsdiqlə', success: 'Uğurlu',
        failed: 'Uğursuz', created: 'Yaradıldı', updated: 'Yeniləndi', deleted: 'Silindi',
    },
    ru: {
        dashboard: 'Панель', products: 'Товары', categories: 'Категории',
        orders: 'Заказы', users: 'Пользователи', coupons: 'Купоны', signOut: 'Выход',
        adminPanel: 'Админ Панель', welcome: 'Добро пожаловать',

        totalOrders: 'Всего Заказов', revenue: 'Доход', totalUsers: 'Всего Пользователей',
        lowStock: 'Мало на складе', monthlySales: 'Продажи за месяц', recentOrders: 'Последние Заказы',
        noOrdersYet: 'Заказов пока нет', orderId: 'ID Заказа', customer: 'Клиент',
        total: 'Итого', status: 'Статус', date: 'Дата',

        addProduct: 'Добавить Товар', searchProducts: 'Поиск товаров...',
        image: 'Фото', title: 'Название', category: 'Категория', price: 'Цена',
        stock: 'Склад', actions: 'Действия', loading: 'Загрузка...', active: 'Активный',
        inactive: 'Неактивный', noProductsFound: 'Товары не найдены',
        deleteProduct: 'Удалить этот товар?',

        editProduct: 'Редактировать Товар', createProduct: 'Создать Товар',
        oldPrice: 'Старая Цена', selectCategory: 'Выберите категорию',
        description: 'Описание', images: 'Изображения', addImages: 'Добавить Фото',
        uploading: 'Загрузка...', clickToUpload: 'Нажмите для загрузки изображений',
        imageFormats: 'JPG, PNG, GIF, WEBP — макс 5МБ',
        attributes: 'Характеристики', material: 'Материал', color: 'Цвет',
        size: 'Размер', brand: 'Бренд', featured: 'Рекомендуемый',
        saving: 'Сохранение...', updateProduct: 'Обновить Товар', cancel: 'Отмена',
        min1Image: 'Загрузите хотя бы 1 изображение',
        titleAz: 'Название (AZ)', titleEn: 'Название (EN)', titleRu: 'Название (RU)',
        descAz: 'Описание (AZ)', descEn: 'Описание (EN)', descRu: 'Описание (RU)',

        addCategory: 'Добавить Категорию', name: 'Название', slug: 'Slug',
        noCategories: 'Нет категорий', update: 'Обновить', create: 'Создать',
        nameAz: 'Название (AZ)', nameEn: 'Название (EN)', nameRu: 'Название (RU)',
        descriptionLabel: 'Описание',

        search: 'Поиск', allStatuses: 'Все Статусы', noOrdersFound: 'Заказы не найдены',
        orderIdOrCustomer: 'ID заказа или имя клиента...', items: 'Товары',

        updateStatus: 'Обновить Статус', shippingAddress: 'Адрес Доставки',
        paymentSummary: 'Итого к оплате', subtotal: 'Подитог', discount: 'Скидка',
        delivery: 'Доставка', orderNotFound: 'Заказ не найден',

        addAdmin: 'Добавить Админа', adminPanelTab: 'Админ Панель', customers: 'Клиенты',
        fullName: 'Полное Имя', email: 'Эл. почта', phone: 'Телефон', role: 'Роль',
        joined: 'Присоединился', you: 'Вы', removeAdmin: 'Удалить Админа',
        noAdminUsers: 'Нет администраторов', noCustomerUsers: 'Нет клиентов',
        password: 'Пароль', newPassword: 'Новый Пароль', leaveBlankToKeep: 'Оставьте пустым',

        addCoupon: 'Добавить Купон', code: 'Код', type: 'Тип', value: 'Значение',
        minOrder: 'Мин Заказ', expires: 'Истекает', noCoupons: 'Нет купонов',
        percent: 'Процент (%)', fixed: 'Фиксир. ($)', never: 'Никогда',

        signIn: 'Войти', signingIn: 'Вход...', adminAccessRequired: 'Требуется доступ администратора',

        delete: 'Удалить', edit: 'Редактировать', confirm: 'Подтвердить', success: 'Успешно',
        failed: 'Ошибка', created: 'Создано', updated: 'Обновлено', deleted: 'Удалено',
    }
}

const LangCtx = createContext()

export function LangProvider({ children }) {
    const [lang, setLangState] = useState(() => localStorage.getItem('adminLang') || 'en')

    const setLang = (l) => { setLangState(l); localStorage.setItem('adminLang', l) }
    const t = (key) => translations[lang]?.[key] || translations.en[key] || key

    return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
