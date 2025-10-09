import AddVoterForm from "@/components/voter/AddVoterForm.tsx";
import VoterList from "@/components/voter/voterList.tsx";

export default function Dashboard(){
    return (
        <div>
            <AddVoterForm />
            <VoterList />
        </div>
    );
}