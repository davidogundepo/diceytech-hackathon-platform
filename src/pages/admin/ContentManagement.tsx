import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileEdit, Image, FileText, Megaphone, Clock } from 'lucide-react';

const ContentManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Content Management</h1>
        <p className="text-slate-400 mt-1">Manage platform content and pages</p>
      </div>

      {/* Coming Soon Message */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Clock className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-slate-400 text-center max-w-md">
            Content management features are currently under development. This section will allow you to manage 
            homepage content, featured sections, announcements, and platform pages.
          </p>
        </CardContent>
      </Card>

      {/* Planned Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
              <FileEdit className="h-6 w-6 text-blue-500" />
            </div>
            <CardTitle className="text-white text-lg">Page Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">
              Edit homepage, about, FAQ, terms, and privacy policy pages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
              <Image className="h-6 w-6 text-purple-500" />
            </div>
            <CardTitle className="text-white text-lg">Media Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">
              Manage platform images, logos, banners, and other assets
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle className="text-white text-lg">Featured Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">
              Manage featured hackathons, projects, and user spotlights
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-2">
              <Megaphone className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-white text-lg">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">
              Create platform-wide announcements and banner notifications
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentManagement;
