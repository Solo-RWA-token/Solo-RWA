export interface Vehicle {
  id: string;
  name: string;
  class: string;
  price: number;
  range: string;
  topSpeed: string;
  image: string;
  images?: string[];
  colorVariants?: VehicleColorVariant[];
  detailImages?: string[];
  category: "SEDAN" | "SUV" | "PERFORMANCE" | "LIMITED";
  specs?: {
    acceleration?: string;
    output?: string;
    cargo?: string;
    seating?: string;
    chargeTime?: string;
    audio?: string;
  };
}

export interface VehicleColorVariant {
  id: string;
  label: string;
  swatch: string;
  image: string;
  images: string[];
}

export const VEHICLES: Vehicle[] = [
  {
    id: "solo",
    name: "SOLO",
    class: "URBAN COMMUTE",
    price: 18500,
    range: "100 MI",
    topSpeed: "80 MPH",
    category: "LIMITED",
    image:
      "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/cdaaaeaf-41b5-4dc1-9577-d784321e561c/slide-solo-red-9.jpg",
    colorVariants: [
      {
        id: "red",
        label: "RED",
        swatch: "#d71920",
        image:
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/cdaaaeaf-41b5-4dc1-9577-d784321e561c/slide-solo-red-9.jpg",
        images: [
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/6c3634ed-4a84-44b0-805a-d85c9d708c4d/slide-solo-red-1.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/b1be8ab7-2116-483d-84cb-72616401c508/slide-solo-red-2.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/d7b476db-f91e-449a-8740-c39b3511cb9d/slide-solo-red-3.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/907ea442-d8a1-4436-a946-7f7e93a40583/slide-solo-red-4.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/6cb0cd44-94ec-4fa2-a6a2-af28ff5cabfb/slide-solo-red-5.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/29bbf35d-8218-47bb-9e5d-585e8a07724c/slide-solo-red-6.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/b699f4c4-cc98-44b8-9aac-0806c84f34d3/slide-solo-red-7.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/b0248660-01c1-4543-aff9-e4b8c5b87a3d/slide-solo-red-8.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/cdaaaeaf-41b5-4dc1-9577-d784321e561c/slide-solo-red-9.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/03825a97-6ac4-4d67-85ac-531d6f46cfc8/slide-solo-red-10.jpg",
        ],
      },
      {
        id: "white",
        label: "WHITE",
        swatch: "#f3f4f6",
        image:
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/63b1eb75-9bce-4621-aa47-59d2bffd7b36/slide-solo-white-1.jpg",
        images: [
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/63b1eb75-9bce-4621-aa47-59d2bffd7b36/slide-solo-white-1.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/40f7701f-2a12-4f2b-a829-21a6057db59d/slide-solo-white-2.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/ab6e9119-1dea-4fed-8d0f-c4b853e5661a/slide-solo-white-3.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/d8c42049-c292-4179-9170-3e6d2b017638/slide-solo-white-4.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/9877d44b-9859-4f37-bafb-256bae68596f/slide-solo-white-5.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/6bf55d6a-2417-4fb6-8b80-10a2bbd16187/slide-solo-white-6.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/e7e1a6c9-fca4-420d-8d46-642d15211329/slide-solo-white-7.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/d501814c-ae84-4236-ab35-848c45c82f0b/slide-solo-white-8.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/f7c87d0c-c2b1-4dc9-8a29-090cd6fd6dd6/slide-solo-white-9.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/7dead614-8d25-4669-a02f-994a0c2e0dd6/slide-solo-white-10.jpg",
        ],
      },
      {
        id: "silver",
        label: "SILVER",
        swatch: "#9ca3af",
        image:
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/af858209-72b8-4286-b262-36771dbaa77d/slide-solo-silver-1.jpg",
        images: [
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/af858209-72b8-4286-b262-36771dbaa77d/slide-solo-silver-1.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/63d545fb-ec2e-49b8-9528-b283ce678387/slide-solo-silver-2.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/ab0777ee-3924-4909-8dd4-5437046208cd/slide-solo-silver-3.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/40f54116-7a4f-42c7-bc13-ad4a58532570/slide-solo-silver-4.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/dffc6b19-20ba-488d-96a6-c24b4c4fa680/slide-solo-silver-5.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/c4b6e6eb-d28b-4746-9e79-10072ec006e9/slide-solo-silver-6.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/8c587cfb-9e36-4170-a815-ebeabec6d3ab/slide-solo-silver-7.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/b579b9a3-5d53-4b0f-bd4f-1029a76ecc3e/slide-solo-silver-8.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/5f3427e4-1c8e-4694-aed6-fec218a8f48c/slide-solo-silver-9.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/44c32753-6a87-4536-9cd2-92b3e1883906/slide-solo-silver-10.jpg",
        ],
      },
      {
        id: "black",
        label: "BLACK",
        swatch: "#111111",
        image:
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/b2c4fcce-24c4-4f51-9aa3-ab8475721a07/slide-solo-black-1.jpg",
        images: [
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/b2c4fcce-24c4-4f51-9aa3-ab8475721a07/slide-solo-black-1.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/b1f74ecc-e7d2-4c1d-a4b5-7a9de16da71b/slide-solo-black-2.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/a166c140-6129-41a7-ba32-7ae0f53fcf3c/slide-solo-black-3.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/661d70c7-4d27-454c-b437-e923de514fa4/slide-solo-black-4.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/97d17e89-1607-428e-84be-04c5f68707d6/slide-solo-black-5.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/ae83609a-379f-4321-b1f2-cb787f458010/slide-solo-black-6.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/dd21bae7-7d06-44a1-ae71-a8ce7e05f89b/slide-solo-black-7.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/18dd12dc-6209-4d86-a616-d2bf6af5fd47/slide-solo-black-8.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/5d928b55-75dc-429d-a699-bfed8e6d5b67/slide-solo-black-9.jpg",
          "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/dd7a0800-ff6f-430e-9556-fd6d63cc465a/slide-solo-black-10.jpg",
        ],
      },
    ],
    detailImages: [
      "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/6e33985b-785c-4b3d-ba29-3b3743fd0c93/slide-solo-red-14.jpg",
      "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/5abac003-7ab6-4369-8369-1fef3cce9155/slide-solo-red-11.jpg",
      "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/67f28423-7d18-4c87-bda2-c742f2f6ccb8/slide-solo-red-13.jpg",
      "https://images.squarespace-cdn.com/content/v1/67096197aac638276220929a/c7dfb66a-bb6a-47aa-9ced-76db04d27e0f/slide-solo-red-12.jpg",
    ],
    specs: { acceleration: "8.0s", cargo: "10 CU FT", chargeTime: "4 HR" },
  },
  {
    id: "x-pulse-01",
    name: "X-PULSE 01",
    class: "INTERCEPTOR CLASS",
    price: 142000,
    range: "540 MI",
    topSpeed: "218 MPH",
    category: "PERFORMANCE",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1ZMffJZujn1grnlRIYoVlt22bUFgDoP1HmgZvM1VwM9LOYuwYVPMo-tp9XFY1ZIgtZJHbZChtYChMT5Z-kU5M90NjLKdOXFhBUeyJYAp3TACvpLn-h08r9fgke6qFU9PrxSeD-bneOkUo9BvFeYrgsQpJKaMa-1SCVjtjdZPlF8hs1FZ-uEvc9UMyUlTiwaBKmy3r_dqbxgFt0vQMAGkBVnhQE9Z-H5ZWytYRBj4Nsxoe-W-w_3yHQ88ZXvbFoapr8-PGK7mXn6w",
    specs: { acceleration: "1.9s", output: "820KW" },
  },
  {
    id: "void-runner",
    name: "VOID RUNNER",
    class: "STEALTH UTILITY",
    price: 189000,
    range: "620 MI",
    topSpeed: "195 MPH",
    category: "LIMITED",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtiDoRX3hCrXRYXmJmNx1uIM4B0CeBYcnkLLSTclHbvEBFsxtZLKyWpWzhz9mwD5LNxxvEipgbnNEoQ_ChHgE2uSaRYFgSUQf-KVjQbU7x_8yIMe94ZXx8NIA7QY0KYoWU_77gY6i3-FBMA47MzWCA7lyrqDOOWvCLzy1X9Hk7KYnOSHd7ruxajzCpaNoYZn-l1mupqvkpyAKREimkZaqXjBFKTCEP7Ht5KucJgTIk_cKnAw2KCCygltyoMHWoX7BbrqIBGTyYDa4",
    specs: { acceleration: "2.4s", output: "750KW" },
  },
  {
    id: "apex-prime",
    name: "APEX PRIME",
    class: "COMMAND UNIT",
    price: 215000,
    range: "480 MI",
    topSpeed: "242 MPH",
    category: "PERFORMANCE",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUkQ_X5lXtSjbUCc43DQi6Jiz0gPEf_0WfUZUi0ixhVK5cbOMb_W3RCzrxi5LaFLQaaiNpdcxz1SmVqSpW6o9-qb31dfx5DwipXSM6WbtNeXVVoNx2T7KrsPTFoJHVMnKGPeIXIouJWKn7ddB_UrvMc5izt0RNL_zutZzbcpy0MOM2a6yX4K-dXXvnXfPSG09Ll1qr2T3ow6Uu3dKPsc10DDcagsRU9tDHIpFJFQp0D0v-xBQbE77irvseXMpgxXMCXyrXEDeVYyM",
    specs: { acceleration: "2.0s", output: "900KW" },
  },
  {
    id: "solx-apex",
    name: "SOLX APEX",
    class: "PERFORMANCE",
    price: 124500,
    range: "412 MI",
    topSpeed: "205 MPH",
    category: "PERFORMANCE",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxMHUMNgTuAhtv3LF4BFWG8ylkKbIeHbGD2_BjxSuXse4rj-DIcyvcFujIqBzxLe3654m2VO7wL5ue5qpr6DVw3x_oqF5Cgn99d8xx3sst8E7___mGOy0y83BXtz8Fugj2a0iUf-nV8aOP1bFluY1Q1Ss4RZjWdS6YStrHbvJa9FfE9ycfnYnuKrGS7B9fOUArNvuX29IIR745agZd1T9p261Ty1NjA7jbuR-syq64vt4cAkKh6M2SaJF5u1srQYdTvSq5u1fHRKE",
    specs: { acceleration: "2.1s", chargeTime: "15 MIN" },
  },
  {
    id: "nexus-voyager",
    name: "NEXUS VOYAGER",
    class: "FAMILY / UTILITY",
    price: 89200,
    range: "380 MI",
    topSpeed: "155 MPH",
    category: "SUV",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCq6K-gq5k2QkX8tlFlrjmyBcv3-uOm0IOb2ib9Hs4eCHPO3_kZcNQo1GGhReqrXJwHl5L9qX-xBPjSCteXkqjTpbbzV_Ntd_HIYs4BZhptnfxA7fRUv62BAHSyA-kYhOAW6spnKLj3c8v6NVhiX7t5chCLB0etzCAo-G8Z1wEj6ilauT_PgooCdAO1NAGQJuMgswfD_Xd6iqyAmGoCQh5OIBEAB7GB-NqKtbvp664dyFCh-nPVFxajMqNm9cMwQIrFSH0BNhDT5mY",
    specs: { acceleration: "3.4s", cargo: "88 CU FT", seating: "7 ADULT" },
  },
  {
    id: "solx-velocity",
    name: "SOLX VELOCITY",
    class: "GRAND TOURING",
    price: 106000,
    range: "520 MI",
    topSpeed: "180 MPH",
    category: "SEDAN",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6-AB0aGdvJ6b4-Har9Q3bGjzAviMRZCBdg5mpKKfH3GhOKP8jaPX9-1hFi9pqouRbbP9JT4lPDh4bAmgE-QzIXLV5g0jESeqnY0DXRGxJpXMsqdAtcGfBNvq_SmUxxUNFDt_iHI36Ekz3qRnlf6Zgk7VymmE0jMgCm9msLkPcnyt5Q1Egzxl7ahRhEM7UmjQ3rn969E6a-yQ6sx1kHV-cV7-AZq3OBivRQ_-bzhZ25SR0AAeIomXStsBjaZ_SJ5UK7F33JpHYVpY",
    specs: { acceleration: "2.9s", audio: "24 SPK", chargeTime: "15 MIN" },
  },
];
