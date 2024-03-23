"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { PiCheckLight, PiSmiley } from "react-icons/pi";
import Navbar from "@/components/navbar";

const FormSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    job_title: z.string(),
    company_name: z.string(),
    help: z.enum([
        "Evaluate Bird for my company",
        "Learn More",
        "Get a Quote",
        "Other",
    ]),

    company_size: z.enum([
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
    ]),
    info: z.string(),
    terms: z.boolean(), // Menambahkan validasi untuk checkbox
});

type FormValues = z.infer<typeof FormSchema>;

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            job_title: "",
            company_name: "",
            help: "Learn More",
            company_size: "1-10",
            info: "",
            terms: false, // Menambahkan nilai default untuk checkbox
        },
    });

    async function onSubmit(data: FormValues) {
        try {
            setLoading(true);
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            setSubmitted(true);
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
            <Navbar 
                scrollToWebsiteDesign={() => {}}
                scrollToGraphicDesign={() => {}}
                scrollToShopifyStores={() => {}}
                scrollToBrands={() => {}}
                scrollToServices={() => {}}
            />
            <div className="md:flex items-start justify-center md:py-20 px-6">
                <div className="">
                    <div className="text-5xl font-medium w-full md:w-2/3 pb-5 md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Contact our sales team
                    </div>

                    <div className="py-4 text-gray-300">
                        Let&apos;s talk about how Bird can help your team work better.
                    </div>
                </div>

                <Form {...form}>
                    {!submitted ? (
                        <div className="space-y-4 h-full border rounded-3xl p-10 md:w-1/3">
                            {/* Form items */}

                            <div className="flex gap-4 items-center">
                                <Checkbox {...form.register("terms")} />
                                <div className="text-xs font-light md:w-3/4 mb-1 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                                    I agree to Bird&apos;s marketing communications related to bird
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    type="submit"
                                    className="text-sm font-light"
                                    disabled={loading}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xl md:text-2xl flex items-center justify-center flex-col px-8">
                            <div className="w-80 py-20">
                                <PiSmiley className="text-6xl text-[#6c6684] mx-auto" />

                                <div className="text-gray-500 font-light text-center justify-center mx-auto py-10">
                                    We&apos;ve received your inquiry and will be contacting you via email shortly.
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}
