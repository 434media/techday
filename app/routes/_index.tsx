import type { MetaFunction } from "@remix-run/node";
import { Gradient } from "~/components/ui/Gradient";
import { Container } from "~/components/ui/Container";
import { Button } from "~/components/ui/Button";
import { Navbar } from "~/components/ui/Navbar";
import { Link } from "@remix-run/react";
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { TechLogo } from "~/components/cta/TechLogo";
import { TechFuel } from "~/components/cta/TechFuel";
import { TechForm } from "~/components/cta/TechForm";
import { TechStartup } from "~/components/cta/TechStartup";
import { TechBloc } from "~/components/cta/TechBloc";
import { TechVC } from "~/components/cta/TechVC";
import { TechCommunity } from "~/components/cta/TechCommunity";
import { TechFinalist } from "~/components/cta/TechFinalist";


export const meta: MetaFunction = () => {
  return [
     {
        title: 'Tech Day 2024 | Building a Stronger Tech Ecosystem Together',
     },
     {
        property: 'og:url',
        content: 'https://sanantoniotechday.com',
     },
     {
        property: 'og:type',
        content: 'website',
     },
     {
        property: 'og:title',
        content: 'Tech Day 2024',
     },
     {
        name: 'description',
        content:
           'Experience Tech Day 2024! A day filled with tech innovation, networking, and excitement! Witness the Tech Fuel 2024 startup pitch competition, explore cutting-edge tech demos, and connect with the vibrant San Antonio tech community. Join us for Tech Day 2024 and be part of the future of tech in San Antonio!',
     },
     {
        property: 'og:image',
        content:
           'https://res.cloudinary.com/jessebubble/image/upload/v1729486057/unreal-sept-8-techday_ysnimr.png',
     },
  ];
};

function Hero() {
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-0 rounded-3xl ring-1 ring-inset ring-black/5" />
      <Container className="relative">
        <Navbar
          banner={
            <Link
              to="https://lu.ma/jzvnpnv6?tk=kjAvym"
              className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-[hover]:bg-fuchsia-950/30"
            >
                Tech Fuel $100K Pitch Competition
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        />
        <div className="pb-24 pt-16 sm:pb-32 sm:pt-24 md:pb-48 md:pt-32">
          <h1 className="font-display text-balance text-6xl/[0.9] font-medium tracking-tight text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            Tech Day 2024
          </h1>
          <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8 flex items-center gap-1">
            Your Complete Guide to San Antonio's Tech Ecosystem
          </p> 
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <Button 
              href="https://airtable.com/apptfFi1y2StuEQ7s/pagcUDiOUo0NzSooJ/form"
              variant="primary"
            >
              Register for Tech Day
            </Button>
            <Button 
              href="https://lu.ma/jzvnpnv6?tk=kjAvym"
              variant="secondary"
            >
              Register for Tech Fuel
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default function Index() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main className="bg-white">
        <Container className="mt-10">
          <TechLogo />
          <TechStartup />
          <TechVC />
          <TechCommunity />
          <TechFinalist />
          <TechFuel />
          <TechForm />
          <TechBloc />
        </Container>
      </main>
      
    </div>
  )
}

