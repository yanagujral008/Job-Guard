import { useEffect, useState } from "react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Company {
  company_name: string;
  company_logo: string;
  company_url: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const defaultLogo =
    "https://cdn-icons-png.flaticon.com/512/889/889192.png"; // clean tech placeholder

  useEffect(() => {
    fetch("/companies.json")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error loading companies:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar */}
      <Header />

      {/* Page Content */}
      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.length > 0 ? (
          companies.map((company, index) => (
            <a
              key={index}
              href={company.company_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardHeader className="flex flex-col items-center pt-6">
                  <div className="w-24 h-24 rounded-full bg-gray-900 p-3 border border-gray-700 flex items-center justify-center">
                    <img
                      src={company.company_logo || defaultLogo}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultLogo;
                      }}
                      alt={company.company_name}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <CardTitle className="text-lg text-center font-semibold text-white mt-4 group-hover:text-blue-400 transition-colors">
                    {company.company_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                  <Badge
                    variant="secondary"
                    className="px-4 py-1 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Visit Site
                  </Badge>
                </CardContent>
              </Card>
            </a>
          ))
        ) : (
          <p className="text-gray-300 text-center col-span-full">
            🚀 No companies available yet.
          </p>
        )}
      </div>
    </div>
  );
}
