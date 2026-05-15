import streamlit as st
import streamlit.components.v1 as components

# 1. PREMIUM CONFIGURATION
st.set_page_config(
    page_title="Squarun - Anti Gravity",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# 2. HIDE STREAMLIT UI (Premium Look)
st.markdown("""
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {
        padding-top: 0rem;
        padding-bottom: 0rem;
        padding-left: 0rem;
        padding-right: 0rem;
    }
    iframe {
        border: none;
        width: 100%;
        height: 100vh;
    }
    body {
        background-color: #050510;
        overflow: hidden;
    }
    </style>
    """, unsafe_allow_html=True)

def main():
    # URL of your deployed Next.js site on GitHub Pages
    # This is the most reliable way to show your game in Streamlit
    GAME_URL = "https://kschouhanpali-coder.github.io/Squarun"
    
    # Display the game in a full-screen iframe
    components.iframe(GAME_URL, height=1000, scrolling=True)
    
    st.info("💡 Tip: If you see a 'Load Failed' error, make sure you have added your Supabase Secrets to GitHub Actions.")

if __name__ == "__main__":
    main()
