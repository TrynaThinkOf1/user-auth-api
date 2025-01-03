import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { updateUser } from "../services/apiService.ts";

const SettingsPage: React.FC = () => {
    const { state } = useLocation();
    const user = state?.user;
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

    const toggleEmailPopup = () => {
        setShowEmailPopup(!showEmailPopup);
    };

    const handleSendEmail = async () => {
        setIsSendingEmail(true);
        try {
            const response = await updateUser({"newEmail": newEmail});
            console.log("Verification email sent:", response);
            alert("Verification email sent to " + newEmail);
        } catch (error) {
            console.error("Error sending verification email:", error);
            alert("Failed to send verification email. Please try again.");
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleCommitChange = async () => {
        setIsUpdatingEmail(true);
        try {
            const payload = {
                "verificationCode": verificationCode,
                "verifiedEmail": newEmail
            };
            const response = await updateUser(payload);
            console.log("Email updated successfully:", response);
            alert("Email updated successfully!");
            toggleEmailPopup();
        } catch (error) {
            console.error("Error updating email:", error);
            alert("Failed to update email. Please try again.");
        } finally {
            setIsUpdatingEmail(false);
        }
    };

    const renderSettings = () => {
        if (!user) {
            return (
                <div id="outer-container">
                    <h2>User Not Found</h2>
                    <p>You need to log in to access this page.</p>
                    <Link to="/login">Go to Login Page</Link>
                </div>
            );
        }

        return (
            <div className={""}>
                <h2>Settings</h2>
                <div className={""}>
                    <label>Current Email: {user.email}</label>
                    <button className={""} onClick={toggleEmailPopup}>
                        Change Email
                    </button>
                </div>

                {showEmailPopup && (
                    <div className={""}>
                        <div className={""}>
                            <h3>Change Email</h3>
                            <div className={""}>
                                <label>New Email:</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className={""}
                                />
                            </div>
                            <div className={""}>
                                <label>Verification Code:</label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className={""}
                                />
                            </div>
                            <div className={""}>
                                <button
                                    onClick={handleSendEmail}
                                    className={""}
                                    disabled={isSendingEmail}
                                >
                                    {isSendingEmail ? "Sending..." : "Send Email"}
                                </button>
                                <button
                                    onClick={handleCommitChange}
                                    className={""}
                                    disabled={isUpdatingEmail}
                                >
                                    {isUpdatingEmail ? "Updating..." : "Commit Change"}
                                </button>
                                <button onClick={toggleEmailPopup} className={""}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return renderSettings();
};

export default SettingsPage;
