import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Search as SearchIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download
} from "lucide-react";
import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

// Sample data
const trafficData = [
  { date: "05/01", direct: 1200, organic: 800, referral: 400, social: 600 },
  { date: "05/08", direct: 1300, organic: 900, referral: 450, social: 700 },
  { date: "05/15", direct: 1150, organic: 950, referral: 500, social: 800 },
  { date: "05/22", direct: 1400, organic: 1000, referral: 600, social: 850 },
  { date: "05/29", direct: 1500, organic: 1200, referral: 650, social: 900 },
];

const pageViewsData = [
  { page: "/", views: 3600, avgTime: "2:30" },
  { page: "/courses", views: 2800, avgTime: "3:15" },
  { page: "/course/html-fundamentals", views: 1900, avgTime: "5:45" },
  { page: "/course/css-mastery", views: 1700, avgTime: "4:20" },
  { page: "/course/javascript-fundamentals", views: 2100, avgTime: "6:10" },
  { page: "/login", views: 1500, avgTime: "1:10" },
  { page: "/register", views: 1100, avgTime: "1:45" },
  { page: "/pomodoro", views: 950, avgTime: "4:30" },
  { page: "/eisenhower", views: 820, avgTime: "3:50" },
  { page: "/achievements", views: 780, avgTime: "2:15" },
];

const searchKeywordsData = [
  { keyword: "learn javascript", clicks: 387, impressions: 1243, ctr: "31.1%", position: 2.4 },
  { keyword: "html tutorial", clicks: 296, impressions: 987, ctr: "30.0%", position: 2.7 },
  { keyword: "css course online", clicks: 245, impressions: 856, ctr: "28.6%", position: 3.1 },
  { keyword: "react vs angular", clicks: 198, impressions: 734, ctr: "27.0%", position: 3.5 },
  { keyword: "typescript advanced", clicks: 176, impressions: 612, ctr: "28.8%", position: 2.9 },
  { keyword: "frontend developer skills", clicks: 167, impressions: 589, ctr: "28.4%", position: 3.2 },
  { keyword: "how to learn programming", clicks: 154, impressions: 532, ctr: "28.9%", position: 3.0 },
  { keyword: "web development roadmap", clicks: 143, impressions: 498, ctr: "28.7%", position: 2.8 },
];

const deviceData = [
  { name: "Desktop", value: 58 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 7 },
];

const countryData = [
  { country: "United States", users: 350, change: 12.5 },
  { country: "Russia", users: 275, change: 15.2 },
  { country: "Germany", users: 185, change: 8.9 },
  { country: "United Kingdom", users: 150, change: 7.5 },
  { country: "India", users: 125, change: 22.3 },
  { country: "Canada", users: 110, change: 5.8 },
  { country: "France", users: 95, change: 6.2 },
  { country: "Australia", users: 85, change: 4.1 },
];

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export function AnalyticsManagement() {
  const [timeRange, setTimeRange] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPages, setFilteredPages] = useState(pageViewsData);
  const [filteredKeywords, setFilteredKeywords] = useState(searchKeywordsData);

  useEffect(() => {
    setFilteredPages(
      pageViewsData.filter((page) => 
        page.page.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    
    setFilteredKeywords(
      searchKeywordsData.filter((keyword) => 
        keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1>Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 hours</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">1,376</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-50 text-green-600 hover:bg-green-50 flex items-center gap-1 mr-2">
                <ArrowUpRight className="h-3 w-3" />
                8.2%
              </Badge>
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">24,892</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-50 text-green-600 hover:bg-green-50 flex items-center gap-1 mr-2">
                <ArrowUpRight className="h-3 w-3" />
                12.5%
              </Badge>
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              Avg. Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">4:32</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-50 text-green-600 hover:bg-green-50 flex items-center gap-1 mr-2">
                <ArrowUpRight className="h-3 w-3" />
                3.8%
              </Badge>
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-500" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">32.4%</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-red-50 text-red-600 hover:bg-red-50 flex items-center gap-1 mr-2">
                <ArrowDownRight className="h-3 w-3" />
                1.2%
              </Badge>
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Traffic Overview
              </CardTitle>
              <CardDescription>
                Website traffic by source for the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }} 
                    />
                    <Legend />
                    <Area type="monotone" dataKey="direct" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Direct" />
                    <Area type="monotone" dataKey="organic" stackId="1" stroke="#10b981" fill="#10b981" name="Organic Search" />
                    <Area type="monotone" dataKey="referral" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Referral" />
                    <Area type="monotone" dataKey="social" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Social Media" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Top Pages
              </CardTitle>
              <CardDescription>
                Most viewed pages with engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search pages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8" 
                  />
                </div>
                <Button variant="outline" className="ml-2 flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Page Views</TableHead>
                      <TableHead className="text-right">Avg. Time on Page</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.map((page) => (
                      <TableRow key={page.page}>
                        <TableCell className="font-medium">{page.page}</TableCell>
                        <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{page.avgTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5 text-purple-500" />
                Search Performance
              </CardTitle>
              <CardDescription>
                Top performing keywords in search engines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search keywords..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8" 
                  />
                </div>
                <Button variant="outline" className="ml-2 flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Impressions</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeywords.map((keyword) => (
                      <TableRow key={keyword.keyword}>
                        <TableCell className="font-medium">{keyword.keyword}</TableCell>
                        <TableCell className="text-right">{keyword.clicks}</TableCell>
                        <TableCell className="text-right">{keyword.impressions}</TableCell>
                        <TableCell className="text-right">{keyword.ctr}</TableCell>
                        <TableCell className="text-right">{keyword.position}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Device Distribution */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-500" />
                  Device Distribution
                </CardTitle>
                <CardDescription>
                  User visits by device type
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] px-4 pb-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}
                        formatter={(value) => [`${value}%`, 'Percentage']} 
                      />
                      <Legend />
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>
                  Top countries by user count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {countryData.map((country) => (
                    <div key={country.country} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{country.users} users</span>
                        <Badge 
                          className={`${country.change > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} hover:bg-green-50 flex items-center gap-1`}
                        >
                          {country.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {country.change}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}