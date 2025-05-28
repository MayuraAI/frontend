--------------- MESSAGES ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS messages (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- RELATIONSHIPS
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    -- REQUIRED
    content TEXT NOT NULL CHECK (char_length(content) <= 1000000),
    model_name TEXT CHECK (char_length(model_name) <= 1000),
    role TEXT NOT NULL CHECK (char_length(role) <= 1000),
    sequence_number INT NOT NULL
);

-- INDEXES --

CREATE INDEX idx_messages_chat_id ON messages (chat_id);

-- RLS --

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to own messages"
    ON messages
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow view access to messages for non-private chats"
    ON messages
    FOR SELECT
    USING (chat_id IN (
        SELECT id FROM chats WHERE sharing <> 'private'
    ));

-- FUNCTIONS --

CREATE OR REPLACE FUNCTION delete_messages_including_and_after(
    p_user_id UUID, 
    p_chat_id UUID, 
    p_sequence_number INT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM messages 
    WHERE user_id = p_user_id AND chat_id = p_chat_id AND sequence_number >= p_sequence_number;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS --

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
