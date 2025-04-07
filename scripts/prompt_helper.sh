#!/bin/bash

# Basic helper script for the Self-Improvement Framework
# Usage:
#   ./scripts/prompt_helper.sh journal  - Interactively create a new journal entry
#   ./scripts/prompt_helper.sh suggest [category] - Suggest prompts (NYI)

JOURNAL_FILE="../SELF_PROMPT_JOURNAL.md" # Adjust path as needed

# --- Function to add a journal entry ---
add_journal_entry() {
    echo "Adding new entry to $JOURNAL_FILE..."

    # Get today's date
    entry_date=$(date +%F)
    echo "Date: $entry_date"

    # Get Category
    echo -n "Category (e.g., Testing, Documentation, Workflow): "
    read category

    # Get Prompt
    echo "Prompt Used (Enter the prompt, use Ctrl+D when done):"
    prompt_used=$(cat)

    # Get Related context
    echo -n "Related (Commit SHA / Issue # / File Path / N/A): "
    read related

    # Get Insights
    echo "Insights Generated (Enter insights, use Ctrl+D when done):"
    insights=$(cat)

    # Get Actions
    echo "Actions Taken (Enter actions, use Ctrl+D when done):"
    actions=$(cat)

    # Get Effectiveness
    while true; do
        echo -n "Effectiveness (1-5): "
        read effectiveness
        if [[ -n "$effectiveness" && "$effectiveness" =~ ^[1-5]$ ]]; then
            break
        else
            echo "Please enter a number between 1 and 5."
        fi
    done

    # Get Refinements
    echo "Suggested Refinements (Enter refinements, use Ctrl+D when done):"
    refinements=$(cat)

    # --- Append to Journal ---
    {
        echo "" # Add a newline before the entry
        echo "### $entry_date: $category"
        echo ""
        echo "**Prompt Used**:"
        echo '```'
        echo "$prompt_used"
        echo '```'
        echo "**Related**: $related"
        echo "**Insights Generated**:"
        echo "$insights" | sed 's/^/- /' # Format as list
        echo "**Actions Taken**:"
        echo "$actions" | sed 's/^/- /' # Format as list
        echo "**Effectiveness**: $effectiveness"
        echo "**Refinements**:"
        echo "$refinements" | sed 's/^/- /' # Format as list
        echo ""
        echo "---"
    } >> "$JOURNAL_FILE"

    echo "Journal entry added successfully to $JOURNAL_FILE"
    echo "Consider running 'git add $JOURNAL_FILE'"
}

# --- Function to suggest prompts (Not Yet Implemented) ---
suggest_prompts() {
    echo "Suggesting prompts..."
    echo "(Not Yet Implemented)"
    # Future: Could read SELF_PROMPT.md, filter by category,
    # maybe check journal for least recently used prompts.
}


# --- Main Script Logic ---
COMMAND=$1
CATEGORY=$2

case "$COMMAND" in
    journal)
        add_journal_entry
        ;;
    suggest)
        suggest_prompts "$CATEGORY"
        ;;
    *)
        echo "Usage: $0 {journal|suggest [category]}"
        exit 1
        ;;
esac

exit 0