import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetProfile,
  useCreateProfile,
  getGetProfileQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, User, Sparkles } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  stream: z.string().min(1, "Please select your stream"),
  college: z.string().min(2, "College name is required"),
  state: z.string().min(1, "Please select your state"),
  category: z.string().min(1, "Please select your category"),
  financialBackground: z.string().min(1, "Please select your financial background"),
  careerInterest: z.string().min(1, "Please select your career interest"),
  yearOfStudy: z.string().min(1, "Please select your year of study"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh",
  "Dadra & Nagar Haveli","Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const inputStyle = {
  backgroundColor: "rgba(30,41,59,0.8)",
  borderColor: "rgba(99,179,237,0.2)",
  color: "#F8FAFC",
};

interface ProfileFormProps {
  defaultValues: ProfileFormData;
  isExisting: boolean;
}

function ProfileForm({ defaultValues, isExisting }: ProfileFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createProfile = useCreateProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = (data: ProfileFormData) => {
    createProfile.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        toast({ title: "Profile saved!", description: "Your personalised roadmap has been updated." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save profile. Please try again.", variant: "destructive" });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium" style={{ color: "#CBD5E1" }}>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Raghuvarshan V.R" {...field} className="rounded-xl" style={inputStyle} data-testid="input-name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid sm:grid-cols-2 gap-5">
          <FormField control={form.control} name="stream" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium" style={{ color: "#CBD5E1" }}>Stream / Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl" style={inputStyle} data-testid="select-stream">
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent style={{ backgroundColor: "#1E293B", borderColor: "rgba(99,179,237,0.2)", color: "#F8FAFC" }}>
                  {["Engineering","Medical","Science","Commerce","Arts","Law"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="yearOfStudy" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium" style={{ color: "#CBD5E1" }}>Year of Study</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl" style={inputStyle} data-testid="select-year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent style={{ backgroundColor: "#1E293B", borderColor: "rgba(99,179,237,0.2)", color: "#F8FAFC" }}>
                  {["1st Year","2nd Year","3rd Year","4th Year","Final Year","Post Graduate"].map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="college" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium" style={{ color: "#CBD5E1" }}>College / Institution Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Rajalakshmi Institute of Technology" {...field} className="rounded-xl" style={inputStyle} data-testid="input-college" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="state" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium" style={{ color: "#CBD5E1" }}>State</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="rounded-xl" style={inputStyle} data-testid="select-state">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-60 overflow-y-auto" style={{ backgroundColor: "#1E293B", borderColor: "rgba(99,179,237,0.2)", color: "#F8FAFC" }}>
                {INDIAN_STATES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid sm:grid-cols-2 gap-5">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium" style={{ color: "#CBD5E1" }}>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl" style={inputStyle} data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent style={{ backgroundColor: "#1E293B", borderColor: "rgba(99,179,237,0.2)", color: "#F8FAFC" }}>
                  {["SC","ST","OBC","BC","EWS","General"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="financialBackground" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium" style={{ color: "#CBD5E1" }}>Family Annual Income</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl" style={inputStyle} data-testid="select-income">
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent style={{ backgroundColor: "#1E293B", borderColor: "rgba(99,179,237,0.2)", color: "#F8FAFC" }}>
                  {["Below ₹1 Lakh","₹1L - ₹2.5L","₹2.5L - ₹5L","Above ₹5 Lakh"].map(i => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="careerInterest" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium" style={{ color: "#CBD5E1" }}>Career Interest</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="rounded-xl" style={inputStyle} data-testid="select-career">
                  <SelectValue placeholder="What do you want to become?" />
                </SelectTrigger>
              </FormControl>
              <SelectContent style={{ backgroundColor: "#1E293B", borderColor: "rgba(99,179,237,0.2)", color: "#F8FAFC" }}>
                {["Engineering","Medical","Civil Services","Law","Management","Science","Arts"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <button
          type="submit"
          disabled={createProfile.isPending}
          className="w-full py-3.5 rounded-xl text-base font-bold text-white transition-all btn-glow mt-2"
          style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)", opacity: createProfile.isPending ? 0.7 : 1 }}
          data-testid="button-save-profile"
        >
          {createProfile.isPending ? "Saving..." : isExisting ? "Update Profile" : "Save Profile & Get My Roadmap"}
        </button>
      </form>
    </Form>
  );
}

export default function Profile() {
  const { data: profile, isLoading } = useGetProfile({
    query: { queryKey: getGetProfileQueryKey() }
  });

  const emptyDefaults: ProfileFormData = {
    name: "", stream: "", college: "", state: "",
    category: "", financialBackground: "", careerInterest: "", yearOfStudy: "",
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(37,99,235,0.15)" }}>
            <User className="w-5 h-5" style={{ color: "#60a5fa" }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white" data-testid="text-profile-heading">My Profile</h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>Fill in your details to get a personalised roadmap matched just for you</p>
          </div>
        </div>
      </div>

      {!isLoading && profile && (
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl w-fit" style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)" }}>
          <CheckCircle className="w-4 h-4" />
          Profile complete — your roadmap is personalised
        </div>
      )}

      <div className="max-w-2xl rounded-2xl" style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,179,237,0.15)" }}>
        <div className="p-6 border-b" style={{ borderColor: "rgba(99,179,237,0.12)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: "#06B6D4" }} />
            <h2 className="text-lg font-bold text-white">Student Information</h2>
          </div>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>This information powers your personalised scholarship, exam, and mentor matches.</p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-5">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                  <Skeleton className="h-10 w-full rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                </div>
              ))}
            </div>
          ) : (
            <ProfileForm
              key={profile?.id ?? "new"}
              defaultValues={profile ? {
                name: profile.name,
                stream: profile.stream,
                college: profile.college,
                state: profile.state,
                category: profile.category,
                financialBackground: profile.financialBackground,
                careerInterest: profile.careerInterest,
                yearOfStudy: profile.yearOfStudy,
              } : emptyDefaults}
              isExisting={!!profile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
