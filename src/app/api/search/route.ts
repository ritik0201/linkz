import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import  dbConnect  from "@/lib/dbConnect";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json({ data: [] });
        }

        // Search for users where username or fullName matches the query (case-insensitive)
        // This implements "letter by letter" search as the user types
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { fullName: { $regex: query, $options: "i" } },
                { headline: { $regex: query, $options: "i" } }
            ]
        }).select("_id username fullName profileImage image headline profilePicture avatar").limit(10);

        return NextResponse.json({ data: users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}