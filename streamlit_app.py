import streamlit as st
import streamlit.components.v1 as components
import http.server
import socketserver
import threading
import os
import time
import socket

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
    }
    body {
        background-color: #050510;
    }
    </style>
    """, unsafe_allow_html=True)

def get_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def start_server(port, directory):
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=directory, **kwargs)
    
    with socketserver.TCPServer(("", port), Handler) as httpd:
        httpd.serve_forever()

# 3. BACKGROUND SERVER LOGIC
if 'server_port' not in st.session_state:
    DIRECTORY = "out"
    if os.path.exists(DIRECTORY):
        port = get_free_port()
        thread = threading.Thread(target=start_server, args=(port, DIRECTORY), daemon=True)
        thread.start()
        st.session_state.server_port = port
        time.sleep(1)
    else:
        st.session_state.server_port = None

def main():
    port = st.session_state.get('server_port')
    
    if port:
        # Full-screen iframe with no borders
        components.iframe(f"http://localhost:{port}", height=1000)
    else:
        st.error("Project build folder ('out') not found.")
        st.code("Please run: npm run build")
        if st.button("Reload"):
            st.rerun()

if __name__ == "__main__":
    main()
