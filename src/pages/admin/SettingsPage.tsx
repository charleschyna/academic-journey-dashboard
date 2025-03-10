
import { useState } from 'react';
import { useRequireAuth } from '@/lib/auth';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Mail,
  Palette,
  Database,
  Save
} from 'lucide-react';
import PageHeader from '@/components/ui-custom/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Switch
} from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { user, isLoading } = useRequireAuth(['admin']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  const handleSaveSettings = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };
  
  return (
    <div className="page-container">
      <PageHeader 
        title="System Settings"
        description="Configure and customize the school management system"
      />
      
      <Tabs defaultValue="general" className="animate-fade-in">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-64 shrink-0">
            <CardContent className="p-4">
              <TabsList className="flex flex-col w-full h-auto gap-2">
                <TabsTrigger value="general" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="account" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="w-full justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="email" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="database" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Database
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>
          
          <div className="flex-1">
            <TabsContent value="general" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure general school information and system preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="school-name">School Name</Label>
                        <Input id="school-name" defaultValue="Sunrise Public School" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school-code">School Code</Label>
                        <Input id="school-code" defaultValue="SP-2023" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Administrator Email</Label>
                        <Input id="admin-email" type="email" defaultValue="admin@school.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Contact Phone</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="academic-year">Current Academic Year</Label>
                        <Select defaultValue="2023-2024">
                          <SelectTrigger id="academic-year">
                            <SelectValue placeholder="Select academic year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2022-2023">2022-2023</SelectItem>
                            <SelectItem value="2023-2024">2023-2024</SelectItem>
                            <SelectItem value="2024-2025">2024-2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="term">Current Term</Label>
                        <Select defaultValue="term1">
                          <SelectTrigger id="term">
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="term1">Term 1</SelectItem>
                            <SelectItem value="term2">Term 2</SelectItem>
                            <SelectItem value="term3">Term 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">School Address</Label>
                      <Input id="address" defaultValue="123 Education Street, Learning City, ST 12345" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Preferences</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="grading-scale">Grading Scale</Label>
                        <div className="text-sm text-muted-foreground">
                          Set the grading scale system used throughout the application
                        </div>
                      </div>
                      <Select defaultValue="percentage">
                        <SelectTrigger id="grading-scale" className="w-[180px]">
                          <SelectValue placeholder="Select scale" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (0-100)</SelectItem>
                          <SelectItem value="letter">Letter Grade (A-F)</SelectItem>
                          <SelectItem value="gpa">GPA (0.0-4.0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Parent Portal</Label>
                        <div className="text-sm text-muted-foreground">
                          Allow parents to access their children's information
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Student Portal</Label>
                        <div className="text-sm text-muted-foreground">
                          Allow students to access their own academic information
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <div className="text-sm text-muted-foreground">
                          Put the system in maintenance mode (only admins can access)
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Account settings will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure how you receive notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Notification settings will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Appearance settings will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage security and access control settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Security settings will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>
                    Configure email templates and notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Email settings will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="database" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Database Settings</CardTitle>
                  <CardDescription>
                    Manage database configuration and backup settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Database settings will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
