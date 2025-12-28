import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Shield, Zap, Award } from "lucide-react"

const reasons = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your orders delivered to your doorstep in 2-3 business days",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your transactions are protected with industry-leading encryption",
  },
  {
    icon: Zap,
    title: "Best Prices",
    description: "Competitive pricing with regular discounts and exclusive offers",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Every product is vetted for quality and authenticity",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Us?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best shopping experience with premium service and quality products
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
