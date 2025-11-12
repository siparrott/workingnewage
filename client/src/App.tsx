import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { NeonAuthProvider } from './context/NeonAuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './pages/HomePage';
import FotoshootingsPage from './pages/FotoshootingsPage';
import GutscheinPage from './pages/GutscheinPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import WartelistePage from './pages/WartelistePage';
import KontaktPage from './pages/KontaktPage';
import VouchersPage from './pages/VouchersPage';
import VoucherDetailPage from './pages/VoucherDetailPage';
import VoucherCheckoutPage from './pages/VoucherCheckoutPage';
import VoucherSuccessPage from './pages/VoucherSuccessPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderCompletePage from './pages/OrderCompletePage';
import AccountPage from './pages/AccountPage';
import AccountProfilePage from './pages/AccountProfilePage';
import MyArchivePage from './pages/MyArchivePage';
import MySubscriptionPage from './pages/MySubscriptionPage';
import StorageDemoPage from './pages/StorageDemoPage';
import StorageDemoIndexPage from './pages/StorageDemoIndexPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDashboardPageDev from './pages/admin/AdminDashboardPageDev';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import NeonAdminLoginPage from './pages/admin/NeonAdminLoginPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminVoucherSalesPageV3 from './pages/admin/AdminVoucherSalesPageV3';
import AdminClientsPage from './pages/admin/ClientsPage';
import ClientDetailPage from './pages/admin/ClientDetailPage';
import ClientProfilePage from './pages/admin/ClientProfilePage';
import ClientFormPage from './pages/admin/ClientFormPage';
import AdminClientsImportPage from './pages/admin/ClientsImportPage';
import ImportLogsPage from './pages/admin/ImportLogsPage';
import HighValueClientsPage from './pages/admin/HighValueClientsPage';
import GalleriesPage from './pages/admin/GalleriesPage';
import AdminGalleriesPage from './pages/admin/AdminGalleriesPage';
import CalendarPage from './pages/admin/CalendarPage';
import AdminGalleryCreatePage from './pages/admin/GalleryCreatePage';
import AdminGalleryEditPage from './pages/admin/GalleryEditPage';
import AdminGalleryDetailPage from './pages/admin/GalleryDetailPage';
import InvoicesPage from './pages/admin/InvoicesPage';
import AdminPriceWizardPage from './pages/admin/AdminPriceWizardPage';
import AccountingExportPage from './pages/admin/accounting/AccountingExportPage';
import FilesPage from './pages/admin/FilesPage';
import ProDigitalFilesPage from './pages/admin/ProDigitalFilesPage';
import CampaignsPage from './pages/admin/CampaignsPage';
import AdminInboxPageV2 from './pages/admin/AdminInboxPageV2';
import QuestionnairesPageV2 from './pages/admin/QuestionnairesPageV2';
import ComprehensiveReportsPage from './pages/admin/ComprehensiveReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import EmailSettingsPage from './pages/admin/EmailSettingsPage';
import CalendarTest from './pages/admin/CalendarTest';
import CustomizationPage from './pages/admin/CustomizationPage';
import StudioCustomization from './pages/admin/StudioCustomization';
import StudioCalendarPage from './pages/admin/StudioCalendarPage';
import WebsiteCustomizationWizard from './pages/admin/WebsiteCustomizationWizard';
import PhotographyCalendarPage from './pages/admin/PhotographyCalendarPageSimple';
import SurveySystemDemoPage from './pages/SurveySystemDemoPage';
import SurveyTakingPage from './pages/SurveyTakingPage';
import AdminBlogPostsPage from './pages/admin/AdminBlogPostsPage';
import AdminBlogNewPage from './pages/admin/AdminBlogNewPage';
import AdminBlogEditPage from './pages/admin/AdminBlogEditPage';
import KnowledgeBasePage from './pages/admin/KnowledgeBasePage';
import CRMOperationsAssistant from './pages/admin/CRMOperationsAssistant';
import AgentV2Page from './pages/admin/AgentV2Page';
import AgentConsolePage from './pages/admin/AgentConsolePage';
import WebsiteWizard from './pages/admin/WebsiteWizard';
import PriceListSettingsPage from './pages/admin/settings/PriceListSettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NeonProtectedRoute from './components/auth/NeonProtectedRoute';
import VoucherThankYouPage from './pages/VoucherThankYouPage';
import CartPage from './pages/CartPage';
import FamilyGutscheinPage from './pages/gutschein/FamilyGutscheinPage';
import NewbornGutscheinPage from './pages/gutschein/NewbornGutscheinPage';
import MaternityGutscheinPage from './pages/gutschein/MaternityGutscheinPage';
import BusinessFotoshootingPage from './pages/fotoshootings/BusinessFotoshootingPage';
import EventFotoshootingPage from './pages/fotoshootings/EventFotoshootingPage';
import WeddingFotoshootingPage from './pages/fotoshootings/WeddingFotoshootingPage';
import FamilienFotoshootingWienPage from './pages/fotoshootings/FamilienFotoshootingWienPage';
import BabyFotografieWienPage from './pages/fotoshootings/BabyFotografieWienPage';
import SchwangerschaftsfotosWienPage from './pages/fotoshootings/SchwangerschaftsfotosWienPage';
import BusinessPortraitWienPage from './pages/fotoshootings/BusinessPortraitWienPage';
import KinderFotografieWienPage from './pages/fotoshootings/KinderFotografieWienPage';
import PortraitfotografieWienPage from './pages/fotoshootings/PortraitfotografieWienPage';
import UeberUnsPage from './pages/support/UeberUnsPage';
import PreisePage from './pages/support/PreisePage';
import FAQPage from './pages/support/FAQPage';
import KundenstimmenPage from './pages/support/KundenstimmenPage';
import GalleryPage from './pages/GalleryPage';
import PublicGalleriesPage from './pages/PublicGalleriesPage';
import PublicInvoicePage from './pages/PublicInvoicePage';
import ChatBot from './components/chat/ChatBot';
import { GalleryShopTest } from './pages/GalleryShopTest';
import DownloadDataPage from './pages/DownloadDataPage';
import MockSuccessPage from './pages/MockSuccessPage';
import CommunicationsPage from './pages/CommunicationsPage';
import QuestionnaireFormPage from './pages/QuestionnaireFormPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
      <AuthProvider>
        <NeonAuthProvider>
          <AppProvider>
            <CartProvider>
              <LanguageProvider>
              <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/fotoshootings" element={<FotoshootingsPage />} />
                <Route path="/fotoshootings/business" element={<BusinessFotoshootingPage />} />
                <Route path="/fotoshootings/event" element={<EventFotoshootingPage />} />
                <Route path="/fotoshootings/wedding" element={<WeddingFotoshootingPage />} />
                
                {/* SEO Cornerstone Pages */}
                <Route path="/familien-fotoshooting-wien/" element={<FamilienFotoshootingWienPage />} />
                <Route path="/baby-fotografie-wien/" element={<BabyFotografieWienPage />} />
                <Route path="/schwangerschaftsfotos-wien/" element={<SchwangerschaftsfotosWienPage />} />
                <Route path="/business-portrait-wien/" element={<BusinessPortraitWienPage />} />
                
                {/* SEO Pillar Pages */}
                <Route path="/kinder-fotografie-wien/" element={<KinderFotografieWienPage />} />
                <Route path="/portrait-fotografie-wien/" element={<PortraitfotografieWienPage />} />
                
                {/* Support Pages */}
                <Route path="/ueber-uns/" element={<UeberUnsPage />} />
                <Route path="/preise/" element={<PreisePage />} />
                <Route path="/faq/" element={<FAQPage />} />
                <Route path="/kundenstimmen/" element={<KundenstimmenPage />} />
                
                <Route path="/gutschein" element={<GutscheinPage />} />
                <Route path="/gutschein/family" element={<FamilyGutscheinPage />} />
                <Route path="/gutschein/newborn" element={<NewbornGutscheinPage />} />
                <Route path="/gutschein/maternity" element={<MaternityGutscheinPage />} />
                <Route path="/voucher/thank-you" element={<VoucherThankYouPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/warteliste" element={<WartelistePage />} />
                <Route path="/kontakt" element={<KontaktPage />} />
                <Route path="/vouchers" element={<VouchersPage />} />
                <Route path="/voucher/:slug" element={<VoucherDetailPage />} />
                <Route path="/vouchers/checkout/:id" element={<VoucherCheckoutPage />} />
                <Route path="/vouchers/success" element={<VoucherSuccessPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/:id" element={<CheckoutPage />} />
                <Route path="/checkout/voucher/:id" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<OrderCompletePage />} />
                <Route path="/checkout/mock-success" element={<MockSuccessPage />} />
                <Route path="/demo-success" element={<MockSuccessPage />} />
                <Route path="/order-complete/:id" element={<OrderCompletePage />} />                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/profile" element={<AccountProfilePage />} />
                <Route path="/my-archive" element={<MyArchivePage />} />
                <Route path="/my-subscription" element={<MySubscriptionPage />} />
                <Route path="/storage-demo-index" element={<StorageDemoIndexPage />} />
                <Route path="/storage-demo" element={<StorageDemoPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/galleries" element={<PublicGalleriesPage />} />
                <Route path="/galerie" element={<PublicGalleriesPage />} />
                <Route path="/gallery/:slug" element={<GalleryPage />} />
                <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
                <Route path="/survey-demo" element={<SurveySystemDemoPage />} />
                <Route path="/survey/:id" element={<SurveyTakingPage />} />
                <Route path="/q/:token" element={<QuestionnaireFormPage />} />
                <Route path="/invoice/:invoiceId" element={<PublicInvoicePage />} />
                <Route path="/download-data" element={<DownloadDataPage />} />

                {/* Admin routes */}
                <Route path="/admin/login" element={<NeonAdminLoginPage />} />
                <Route path="/admin/supabase-login" element={<AdminLoginPage />} />
                <Route path="/admin/dev" element={<AdminDashboardPageDev />} />
                <Route
                  path="/admin"
                  element={
                    <NeonProtectedRoute>
                      <AdminDashboardPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <NeonProtectedRoute>
                      <AdminDashboardPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/leads"
                  element={
                    <NeonProtectedRoute>
                      <AdminLeadsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/voucher-sales"
                  element={
                    <NeonProtectedRoute>
                      <AdminVoucherSalesPageV3 />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/clients"
                  element={
                    <NeonProtectedRoute>
                      <AdminClientsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/clients/new"
                  element={
                    <NeonProtectedRoute>
                      <ClientFormPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/clients/:id"
                  element={
                    <NeonProtectedRoute>
                      <ClientDetailPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/clients/:id/edit"
                  element={
                    <NeonProtectedRoute>
                      <ClientFormPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/clients/import"
                  element={
                    <NeonProtectedRoute>
                      <AdminClientsImportPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/clients/import-logs"
                  element={
                    <NeonProtectedRoute>
                      <ImportLogsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/high-value-clients"
                  element={
                    <NeonProtectedRoute>
                      <HighValueClientsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/galleries"
                  element={
                    <NeonProtectedRoute>
                      <AdminGalleriesPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/galleries/new"
                  element={
                    <NeonProtectedRoute>
                      <AdminGalleryCreatePage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/galleries/:id/edit"
                  element={
                    <NeonProtectedRoute>
                      <AdminGalleryEditPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/galleries/:id"
                  element={
                    <NeonProtectedRoute>
                      <AdminGalleryDetailPage />
                    </NeonProtectedRoute>
                  }
                />

                <Route
                  path="/admin/calendar"
                  element={
                    <NeonProtectedRoute>
                      <PhotographyCalendarPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/invoices"
                  element={
                    <NeonProtectedRoute>
                      <InvoicesPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/price-wizard"
                  element={
                    <NeonProtectedRoute>
                      <AdminPriceWizardPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/accounting"
                  element={
                    <NeonProtectedRoute>
                      <AccountingExportPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/files"
                  element={
                    <NeonProtectedRoute>
                      <ProDigitalFilesPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/digital-files"
                  element={
                    <NeonProtectedRoute>
                      <ProDigitalFilesPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/campaigns"
                  element={
                    <NeonProtectedRoute>
                      <CampaignsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/email-campaigns"
                  element={
                    <NeonProtectedRoute>
                      <CampaignsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/inbox"
                  element={
                    <NeonProtectedRoute>
                      <AdminInboxPageV2 />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/communications"
                  element={
                    <NeonProtectedRoute>
                      <CommunicationsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/questionnaires"
                  element={
                    <NeonProtectedRoute>
                      <QuestionnairesPageV2 />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <NeonProtectedRoute>
                      <ComprehensiveReportsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/crm-assistant"
                  element={
                    <NeonProtectedRoute>
                      <CRMOperationsAssistant />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/agent-v2"
                  element={
                    <NeonProtectedRoute>
                      <AgentV2Page />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/agent-console"
                  element={
                    <NeonProtectedRoute>
                      <AgentConsolePage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/knowledge-base"
                  element={
                    <NeonProtectedRoute>
                      <KnowledgeBasePage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <NeonProtectedRoute>
                      <SettingsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings/email"
                  element={
                    <NeonProtectedRoute>
                      <EmailSettingsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings/price-list"
                  element={
                    <NeonProtectedRoute>
                      <PriceListSettingsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/customization"
                  element={
                    <NeonProtectedRoute>
                      <CustomizationPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/studio-templates"
                  element={
                    <NeonProtectedRoute>
                      <StudioCustomization />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/website-wizard"
                  element={
                    <NeonProtectedRoute>
                      <WebsiteCustomizationWizard />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/website-analyzer"
                  element={
                    <NeonProtectedRoute>
                      <WebsiteWizard />
                    </NeonProtectedRoute>
                  }
                />
                {/* Public onboarding wizard entry */}
                <Route path="/onboarding" element={<WebsiteWizard />} />
                <Route
                  path="/"
                  element={<HomePage />}
                />
                <Route
                  path="/home"
                  element={<HomePage />}
                />
                <Route
                  path="/admin/calendar"
                  element={
                    <NeonProtectedRoute>
                      <PhotographyCalendarPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/calendar-test"
                  element={
                    <NeonProtectedRoute>
                      <CalendarTest />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/studio-calendar"
                  element={<Navigate to="/admin/calendar" replace />}
                />
                <Route
                  path="/admin/blog"
                  element={
                    <NeonProtectedRoute>
                      <AdminBlogPostsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/posts"
                  element={
                    <NeonProtectedRoute>
                      <AdminBlogPostsPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/new"
                  element={
                    <NeonProtectedRoute>
                      <AdminBlogNewPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/edit/:id"
                  element={
                    <NeonProtectedRoute>
                      <AdminBlogEditPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route
                  path="/admin/clients/new"
                  element={
                    <NeonProtectedRoute>
                      <ClientFormPage />
                    </NeonProtectedRoute>
                  }
                />
                <Route path="/gallery-shop-test" element={<GalleryShopTest />} />
              </Routes>
              <ChatBot />
            </Router>
              </LanguageProvider>
            </CartProvider>
          </AppProvider>
        </NeonAuthProvider>
      </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;